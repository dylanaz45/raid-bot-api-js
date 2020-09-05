class RaidsDAO {
    /**
     *
     * @param db
     * @param userInfo
     * @returns {Promise<boolean>}
     */
    static async startRaid(db, userInfo) {
        try {
            let post = {
                _id: userInfo._id,
                name: userInfo.name,
                date: new Date(),
                den: userInfo.den
            };
            await db.collection("raids").insertOne(post);
            return true
        } catch (err) {
            if (err.code === 11000) {
                return false
            } else {
                throw err
            }
        }
    }

    /**
     *
     * @param db
     * @param userID
     * @returns {Promise<number|Number>}
     */
    static async endRaid(db, userID) {
        let res = await db.collection("raids").deleteOne({
            _id: userID
        })
        return res.deletedCount
    }

    /**
     *
     * @param db
     * @returns {Promise<{}|boolean>}
     */
    static async getRaids(db) {
        let raids = await db.collection("raids").find().toArray();
        if (raids.length > 0) {
            let ret = {}
            raids.forEach((item, index) => {
                ret[index + 1] = [item._id, item.den];
            })
            return ret
        } else {
            return false
        }
    }
}

module.exports = RaidsDAO
