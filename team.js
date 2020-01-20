function TeamPointController(teams, mongoose)
{
    var teamSchema = new mongoose.Schema({
        teamName: String,
        teamMembersCount: Number,
        teamPoint: Number   
    });

    var teamModel = mongoose.model('team', teamSchema);

    console.log("Team Manager Started");

    teams.get("/CreateTeam/:teamName/:teamMembersCount/:teamPoint", function(req, res)
    {
        var teamName = req.params.teamName;
        var teamMembersCount = req.params.teamMembersCount;
        var teamPoint = req.params.teamPoint;


        var newTeam = new teamModel({

            "teamName": teamName,
            "teamMembersCount": teamMembersCount,
            "teamPoint": teamPoint
        });
        
        newTeam.save(function (err) { if (err) console.log('Error on save!') });

        res.send({newTeam});
    });

    teams.get("/CreateUsualTeams", function(req, res)
    {

        var newTeam = new teamModel({

            "teamName": "Red",
            "teamMembersCount": 0,
            "teamPoint": 0
        });
        
        newTeam.save(function (err) { if (err) console.log('Error on save!') });

        var newTeam = new teamModel({

            "teamName": "Blue",
            "teamMembersCount": 0,
            "teamPoint": 0
        });
        
        newTeam.save(function (err) { if (err) console.log('Error on save!') });
        var newTeam = new teamModel({

            "teamName": "Green",
            "teamMembersCount": 0,
            "teamPoint": 0
        });
        
        newTeam.save(function (err) { if (err) console.log('Error on save!') });
        var newTeam = new teamModel({

            "teamName": "Purple",
            "teamMembersCount": 0,
            "teamPoint": 0
        });
        
        newTeam.save(function (err) { if (err) console.log('Error on save!') });
        res.send("DONE");
    });

    teams.get("/ListTeams", function (req, res) { //LISTS ALL Teams IN THE DATABASE
        
        teamModel.find(function (err, team) {
            
            if (err) return console.error(err);
            
            console.log(team);
            
            res.send({ team });
        });
    });

    teams.get("/DeleteTeams", function (req, res) { 
        
        teamModel.remove({}, function (err) {

            console.log('Team DataBase Wiped')
    
            var string = "Team DataBase Wiped";
        
            res.send(string.toString());
        });
    });

    teams.get("/ClearAllTeamPoints", function (req, res) { //BIG RED BUTTON

        teamModel.findOne({ "teamName": "Blue" }, (err, team) => {
            if (!team) {
                console.log("Didnt find a player with that ID");
                res.send("Didnt find a player with that ID");
            }
            else {
                console.log("Found player: " + team);
                team.teamPoint = 0;
                team.save(function (err) { if (err) console.log('Error on save!') });
            }
        });
        teamModel.findOne({ "teamName": "Purple" }, (err, team) => {
            if (!team) {
                console.log("Didnt find a player with that ID");
                res.send("Didnt find a player with that ID");
            }
            else {
                console.log("Found player: " + team);
                team.teamPoint = 0;
                team.save(function (err) { if (err) console.log('Error on save!') });
            }
        });
        teamModel.findOne({ "teamName": "Green" }, (err, team) => {
            if (!team) {
                console.log("Didnt find a player with that ID");
                res.send("Didnt find a player with that ID");
            }
            else {
                console.log("Found player: " + team);
                team.teamPoint = 0;
                team.save(function (err) { if (err) console.log('Error on save!') });
            }
        });
        teamModel.findOne({ "teamName": "Red" }, (err, team) => {
            if (!team) {
                console.log("Didnt find a player with that ID");
                res.send("Didnt find a player with that ID");
            }
            else {
                console.log("Found player: " + team);
                team.teamPoint = 0;
                team.save(function (err) { if (err) console.log('Error on save!') });
            }
        });

        res.send("DONE");
    });

    teams.get("/AddPoints/:teamName/:teamPoints", function (req, res) {

        teamName = req.params.teamName;
        teamPoints = req.params.teamPoints;

        teamModel.findOne({ "teamName": teamName }, (err, team) => {
            if (!team) {
                console.log("Didnt find a team with that name");
                res.send("Didnt find a team with that name");
            }
            else {

                    teamModel.updateOne({ teamName: teamName },{$inc: { teamPoint: teamPoints } }, function (error, result) {
                        if (error) res.send(error);
                        else res.send(result);
                    });
            }
        });
    });

    teams.get("/AddMembers/:teamName/:teamMembers", function (req, res) {

        teamName = req.params.teamName;
        teamMembers = req.params.teamMembers;

        teamModel.findOne({ "teamName": teamName }, (err, team) => {
            if (!team) {
                console.log("Didnt find a team with that name");
                res.send("Didnt find a team with that name");
            }
            else {
                teamModel.updateOne({ teamName: teamName },{$inc: { teamMembersCount: teamMembers } }, function (error, result) {
                    if (error) res.send(error);
                    else res.send(result);
                });
            }
        });
    });


}

module.exports = TeamPointController;