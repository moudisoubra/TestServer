

function Awarder(award, mongoose)
{
    var awardSchema = new mongoose.Schema({
        awardedPerson: String,
        awardContent: String,
        awardID: String
    });

    var awardModel = mongoose.model('awards', awardSchema);

    console.log("Awarder Server Started");

    award.get("/CreateAwardPost/:userID/:userName/:content", function(req, res)
    {
        var userID = req.params.userID;
        var userName = req.params.userName;
        var content = req.params.content;


        var post = new awardModel({

            "userID": userID,
            "userName": userName,
            "awardContent": content
        });
        
        post.blogID = post._id;
        post.save(function (err) { if (err) console.log('Error on save!') });

        res.send({post});
    });

    award.get("/listAllAwardPosts", function (req, res) { //LISTS ALL Awards IN THE DATABASE
        
        awardModel.find(function (err, award) {
            
            if (err) return console.error(err);
            
            console.log(award);
            
            res.send({ award });
        });
    });

    award.get("/ClearAllAwards", function (req, res) { //BIG RED BUTTON

        awardModel.remove({}, function (err) {
            console.log('Awards DataBase Wiped')
    
            var string = "Awards DataBase Wiped";
        
            res.send(string.toString());
        });
    
    });

}

module.exports = Awarder;