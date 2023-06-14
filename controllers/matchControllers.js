const UserCollection = require('../models/userSchema');
const ErrorStatus = require('../utils/errorStatus');
const getMatchedUsers = require("../utils/matchUtils.js");



//IMPLEMENT MATCH ALGORITHM ii

// (1) get interest array of "A" User
// (2) get all B users
// (3) get interest array from single B user
// (4) two iterations and compare: 
//      I: iterate through B users 
//      II: iterate through B users interests 
//      III: save B users id {_id: number, matchType: string, searchTag: string} in new array iiArr
// (3) UserCompare: if there is one interest match

//IMPLEMENT MATCH ALGORITHM ii


const getMatches = async (req, res, next) => {
    try {
      const { usersAround } = req;
      const { interests, skills } = await UserCollection.findById(req.userId);
      const resultArr = [];
  
      if (interests.length === 0 && skills.length === 0)
        throw new ErrorStatus(
          "authenticated User has neither interessts nor skills",
          500
        );
  
      //ii match
      interests.forEach((i) => {
        const arr = getMatchedUsers(usersAround, "ii", i.name, "interests");
        arr.forEach((e) => resultArr.push(e));
      });
  
      //is match
      interests.forEach((i) => {
        const arr = getMatchedUsers(usersAround, "is", i.name, "skills");
        arr.forEach((e) => resultArr.push(e));
      });
  
      //si match
      skills.forEach((i) => {
        const arr = getMatchedUsers(usersAround, "si", i.name, "interests");
        arr.forEach((e) => resultArr.push(e));
      });
  
      //ss match
      skills.forEach((i) => {
        const arr = getMatchedUsers(usersAround, "ss", i.name, "skills");
        arr.forEach((e) => resultArr.push(e));
      });
  
      // get set of unique id´s from resultArr
      const idSet = new Set(resultArr.map((m) => m._id.toHexString()));
      const uniqueIdArr = Array.from(idSet);
  
      //--- formating matchresult ---
  
      //built structure for final result array
      const formattedResultArr = uniqueIdArr.map((i) => {
        return {
          user: {
            _id: i,
            matches: null,
          },
        };
      });
  
      //fill final result array
      formattedResultArr.forEach((i) => {
        i.user.matches = resultArr
          .filter((m) => m._id == i.user._id)
          .map((m) => {
            return { matchType: m.matchType, searchTag: m.searchTag };
          });
      });
  
      // sort for decending amount of matches
      formattedResultArr.sort(
        (a, b) => b.user.matches.length - a.user.matches.length
      );
  
      return res.send(formattedResultArr);
    } catch (error) {
      next(error);
    }
  };

  module.exports = {
    getMatches
  };

