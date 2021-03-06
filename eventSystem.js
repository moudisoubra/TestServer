function EventSystem(events, mongoose)
{
    //Create Event
    //Register Event in app
    //Event Parameters : Voted For
    //                   Voted Against
    //                   Number of people Voted
    //                   List of people Voted
    //Whenever Someone votes they get added to relative list of voted for or against and list of people voted
    //To check if someone has voted before check if they are in that list of people voted
    //If someone has voted, the event will still appear on their screen but it will appear wihtout voting allowed

    var eventSchema = new mongoose.Schema({
        eventName: String,
        eventDescription: String,
        totalNumberVoted: Number,
        numberVotedAgainst: Number,
        numberVotedFor: Number,        
        totalNumberVotedString: String,
        numberVotedAgainstString: String,
        numberVotedForString: String,
        eventID: String,
        membersVoted: [String]
    });

    var eventModel = mongoose.model('events', eventSchema);

    console.log("Event System Started");

    events.get("/eventPage", function(req, res)
    {
        res.sendFile(__dirname+"/eventPage.html");
    });

    events.get("/updateEventArray/:eventID/:memberID", function (req, res)
    {
        var eventID = req.params.eventID;
        var memberID = req.params.memberID;

        eventModel.findOne({ "eventID": eventID }, (err, event) => {
            if (!event) {
                console.log("Didnt find an event with that name");
                res.send("Didnt find an event with that name");
            }
            else {

                    eventModel.updateOne({ eventID: eventID },{$push:{ membersVoted : memberID}}, function (error, result) {
                        if (error) res.send(error);
                    });
                    res.send(event.membersVoted);
            }

        }); 
    });

    events.get("/SendEventArray/:eventID", function (req, res)
    {
        var eventID = req.params.eventID;

        eventModel.findOne({ "eventID": eventID }, (err, event) => {
            if (!event) {
                console.log("Didnt find an event with that name");
                res.send("Didnt find an event with that name");
            }
            else {
                    res.send(event);
            }

        }); 
    });

    events.get("/CheckArray/:eventID/:memberID", function (req, res)
    {
        var eventID = req.params.eventID;
        var memberID = req.params.memberID;

                eventModel.findOne( {  "eventID" : eventID, "membersVoted" : memberID} , (err, ID) => {

                    if(!ID)
                    {
                        res.send("False");
                    }
                    else
                    {
                        res.send("True");
                    }

                }); 

    });


    events.get("/CreateEvent/:eventName/:eventDescription", function(req, res)
    {
        var eventName = req.params.eventName; 
        var eventDescription = req.params.eventDescription;


        var newEvent = new eventModel({

            "eventName": eventName,
            "eventDescription": eventDescription,
            "totalNumberVoted": 0,
            "numberVotedAgainst": 0,
            "numberVotedFor": 0,
            "totalNumberVotedString" : "0",
            "numberVotedAgainstString" : "0",
            "numberVotedForString" : "0"
        });
        newEvent.awardID = newEvent._id;
        newEvent.save(function (err) { if (err) console.log('Error on save!') });

        res.send({newEvent});
    });

    events.post("/WebsiteCreateEvent", function(req, res)
    {
        var eventName = req.body.eventName; 
        var eventDescription = req.body.eventDescription;


        var newEvent = new eventModel({

            "eventName": eventName,
            "eventDescription": eventDescription,
            "totalNumberVoted": 0,
            "numberVotedAgainst": 0,
            "numberVotedFor": 0,
            "totalNumberVotedString" : "0",
            "numberVotedAgainstString" : "0",
            "numberVotedForString" : "0"
        });
        newEvent.eventID = newEvent._id;
        newEvent.save(function (err) { if (err) console.log('Error on save!') });

        res.sendFile(__dirname+"/EventPosted.html");
    });

    events.get("/ListEvents", function (req, res) { //LISTS ALL Teams IN THE DATABASE
        
        eventModel.find(function (err, events) {

            if (err) return console.error(err);
            
            console.log(events);
            
            res.send({ events });
        });
    });

    events.get("/AddToPositive/:eventID/:number", function (req, res) { 
        
        var eventID = req.params.eventID;
        var points = req.params.number;
        
        eventModel.findOne({ "eventID": eventID }, (err, event) => {
            if (!event) {
                console.log("Didnt find an event with that name");
                res.send("Didnt find an event with that name");
            }
            else {

                    eventModel.updateOne({ eventID: eventID },{$inc: { numberVotedFor: points } }, function (error, result) {
                        if (error) res.send(error);
                    });
                    eventModel.updateOne({ eventID: eventID },{$inc: { totalNumberVoted: points } }, function (error, result) {
                        if (error) res.send(error);
                    });

                    var votesFor = event.numberVotedFor + 1;
                    var votes = event.totalNumberVoted + 1;

                    eventModel.updateOne({ eventID: eventID },{$set: { "totalNumberVotedString" : votes.toString()}}, function (error, result) {
                        if (error) res.send(error);
                    });                    
                    eventModel.updateOne({ eventID: eventID },{$set: { "numberVotedForString" : votesFor.toString()}}, function (error, result) {
                        if (error) res.send(error);
                    });
                    res.send("Added to Positive: " + eventID);
            }

        });       

    });

    events.get("/AddToNegative/:eventID/:number", function (req, res) { 
        
        var eventID = req.params.eventID;
        var points = req.params.number;
        
        eventModel.findOne({ "eventID": eventID }, (err, event) => {
            if (!event) {
                console.log("Didnt find an event with that name");
                res.send("Didnt find an event with that name");
            }
            else {

                    eventModel.updateOne({ eventID: eventID },{$inc: { numberVotedAgainst: points } }, function (error, result) {
                        if (error) res.send(error);
                    });
                    eventModel.updateOne({ eventID: eventID },{$inc: { totalNumberVoted: points } }, function (error, result) {
                        if (error) res.send(error);
                    });
                    var votesAgainst = event.numberVotedAgainst  + 1;
                    var votes = event.totalNumberVoted  + 1;

                    eventModel.updateOne({ eventID: eventID },{$set: { "totalNumberVotedString" : votes.toString()}}, function (error, result) {
                        if (error) res.send(error);
                    });                    
                    eventModel.updateOne({ eventID: eventID },{$set: { "numberVotedAgainstString" : votesAgainst.toString()}}, function (error, result) {
                        if (error) res.send(error);
                    });

                    res.send("Added to Negative: " + eventID);
            }
        });

    });    
    
    events.get("/ClearAllEvents", function (req, res) { //BIG RED BUTTON

        eventModel.remove({}, function (err) {
            console.log('Events DataBase Wiped')
    
            var string = "Events DataBase Wiped";
        
            res.send(string.toString());
        });
    
    });

}
module.exports = EventSystem;