import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let transactionFiles = Map.empty<Principal, List.List<Text>>();

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

  public query ({ caller }) func getCallerFiles() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view files");
    };
    switch (transactionFiles.get(caller)) {
      case null { [] };
      case (?files) { files.toArray() };
    };
  };

  public query ({ caller }) func getUserFiles(user : Principal) : async [Text] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other users' files");
    };
    switch (transactionFiles.get(user)) {
      case null { [] };
      case (?files) { files.toArray() };
    };
  };

  public shared ({ caller }) func addFile(filename : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add files");
    };
    let currentFiles = switch (transactionFiles.get(caller)) {
      case null { List.empty<Text>() };
      case (?files) { files };
    };
    currentFiles.add(filename);
    transactionFiles.add(caller, currentFiles);
  };

  public shared ({ caller }) func removeFile(filename : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove files");
    };
    switch (transactionFiles.get(caller)) {
      case null { Runtime.trap("No files found") };
      case (?files) {
        let updatedFiles = files.filter(func(f) { f != filename });
        transactionFiles.add(caller, updatedFiles);
      };
    };
  };

  public shared ({ caller }) func clearCallerFiles() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear their files");
    };
    transactionFiles.add(caller, List.empty<Text>());
  };

  public query ({ caller }) func getAllUsers() : async [Principal] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };
    userProfiles.keys().toArray();
  };

  public shared ({ caller }) func deleteUserProfile(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete user profiles");
    };
    userProfiles.remove(user);
  };

  public shared ({ caller }) func deleteUserFiles(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete user files");
    };
    transactionFiles.remove(user);
  };
};
