import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module Transaction {
    public type TransactionType = {
      #received;
      #sent;
    };

    public type Transaction = {
      transactionType : TransactionType;
      amount : Nat;
      date : Time.Time;
      note : Text;
    };

    public func compareByDate(t1 : Transaction, t2 : Transaction) : Order.Order {
      Int.compare(t1.date, t2.date);
    };
  };

  type Transaction = Transaction.Transaction;

  let userTransactionsMap = Map.empty<Principal, List.List<Transaction>>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addTransaction(transaction : Transaction) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };

    let transactionsList = switch (userTransactionsMap.get(caller)) {
      case (?existingList) { existingList };
      case (null) {
        let newList = List.empty<Transaction>();
        newList;
      };
    };

    transactionsList.add(transaction);
    userTransactionsMap.add(caller, transactionsList);
  };

  public query ({ caller }) func getTransactionsForMonth(year : Nat, month : Nat) : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };

    switch (userTransactionsMap.get(caller)) {
      case (null) { Runtime.trap("You have no transactions yet") };
      case (?userTransactions) {
        let filteredTransactions = userTransactions.filter(
          func(transaction) {
            let transactionYear = getYear(transaction.date);
            let transactionMonth = getMonth(transaction.date);

            transactionYear == year and transactionMonth == month
          }
        );

        filteredTransactions.toArray().reverse();
      };
    };
  };

  public shared ({ caller }) func getMonthlyTotals(year : Nat, month : Nat) : async {
    totalReceived : Nat;
    totalSent : Nat;
    balance : Int;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view monthly totals");
    };

    let monthlyTransactions = await getTransactionsForMonth(year, month);

    let totals = monthlyTransactions.foldLeft(
      { received = 0; sent = 0 },
      func(acc, transaction) {
        switch (transaction.transactionType) {
          case (#received) {
            { received = acc.received + transaction.amount; sent = acc.sent };
          };
          case (#sent) {
            { received = acc.received; sent = acc.sent + transaction.amount };
          };
        };
      },
    );

    let balance = totals.received.toInt() - totals.sent.toInt();

    {
      totalReceived = totals.received;
      totalSent = totals.sent;
      balance;
    };
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };

    switch (userTransactionsMap.get(caller)) {
      case (null) { Runtime.trap("You have no transactions yet") };
      case (?transactionsList) { transactionsList.toArray().reverse() };
    };
  };

  func getYear(time : Time.Time) : Nat {
    let nanosPerYear = 31556952000000000; // 365.25 days in nanoseconds
    let basicYear : Int = time / nanosPerYear;
    if (basicYear < 0) { return 1970 };
    basicYear.toNat() + 1970;
  };

  func getMonth(time : Time.Time) : Nat {
    let nanosPerMonth = 2629746000000000; // Average month (30.44 days) in nanoseconds
    let monthsSince1970 : Int = time / nanosPerMonth;
    if (monthsSince1970 <= 0) { return 1 };
    ((monthsSince1970 % 12).toNat() + 1);
  };
};
