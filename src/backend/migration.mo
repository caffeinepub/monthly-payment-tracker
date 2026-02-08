import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = { name : Text };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    userTransactionsMap : Map.Map<Principal, List.List<{ transactionType : { #received; #sent }; amount : Nat; date : Int; note : Text }>>;
  };

  type NewUserProfile = {
    name : Text;
    email : ?Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    transactionFiles : Map.Map<Principal, List.List<Text>>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldProfile) {
        {
          name = oldProfile.name;
          email = null;
        };
      }
    );
    { userProfiles = newUserProfiles; transactionFiles = Map.empty<Principal, List.List<Text>>() };
  };
};
