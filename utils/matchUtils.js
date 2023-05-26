


const getMatchedUsers = (usersAround, matchType, searchTag, searchChar) => {
    try {
        //console.log(matchType +' searchTag: ' + searchTag)

        if(!matchType) throw new Error('no matchType provided') 
        if(!searchTag) throw new Error('no searchTag provided') 
        if(!usersAround) throw new Error('could not find users around') 

        const foundUsers =  usersAround.filter(u => {
            return u[searchChar].some(i => i.name === searchTag)
        })

        // output object: {_id: number, matchType: string, searchTag: string}
        const matchResult = foundUsers.map(u => {
            return {_id: u._id, matchType: matchType, searchTag: searchTag}
        }
        )
                
        return matchResult
    } catch (error) {
        console.log(error)
    }
}

module.exports = getMatchedUsers