import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import VarArray "mo:core/VarArray";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Session Management
  let sessions = Map.empty<Text, [MentorResponse]>();

  // Mentor Response struct
  type MentorResponse = {
    approach : Text;
    tradeOffs : Text;
    realWorldAnalogy : Text;
    betterAlternative : Text;
  };

  module MentorResponse {
    public type MentorResponse = {
      approach : Text;
      tradeOffs : Text;
      realWorldAnalogy : Text;
      betterAlternative : Text;
    };

    public func compare(a : MentorResponse, b : MentorResponse) : Order.Order {
      Text.compare(a.approach, b.approach);
    };
  };

  // Store Mentor Response
  public shared ({ caller }) func storeMentorResponse(sessionId : Text, response : MentorResponse) : async () {
    let existing = switch (sessions.get(sessionId)) {
      case (null) { [response] };
      case (?responses) { responses.concat([response]) };
    };
    sessions.add(sessionId, existing);
  };

  // Git Conflict Resolution Simulator
  type MergeConflict = {
    base : Text;
    ours : Text;
    theirs : Text;
    resolved : Text;
    isValid : Bool;
    hints : [Text];
  };

  let conflicts = Map.empty<Text, MergeConflict>();

  // Industry Challenge Feed
  type Challenge = {
    id : Text;
    description : Text;
    difficulty : Nat;
    estimatedTime : Nat;
  };

  let challenges = Map.empty<Text, Challenge>();

  // Add Challenge
  public shared ({ caller }) func addChallenge(id : Text, description : Text, difficulty : Nat, estimatedTime : Nat) : async () {
    let challenge : Challenge = {
      id;
      description;
      difficulty;
      estimatedTime;
    };
    challenges.add(id, challenge);
  };

  // Get Challenge
  public query ({ caller }) func getChallenge(id : Text) : async Challenge {
    switch (challenges.get(id)) {
      case (null) { Runtime.trap("Invalid challenge id " # id) };
      case (?challenge) { challenge };
    };
  };

  // Get All Challenges
  public query ({ caller }) func getAllChallenges() : async [Challenge] {
    challenges.values().toArray();
  };
};
