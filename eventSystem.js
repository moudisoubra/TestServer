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
        eventID: String
    });

    var eventModel = mongoose.model('event', eventSchema);

    console.log("Event System Started");

    events.get("/eventPage", function(req, res)
    {
        res.sendFile(__dirname+"/eventPage.html");
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
            "numberVotedFor": 0
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
            "eventDescription": eventDescription
        });
        newEvent.eventID = newEvent._id;
        newEvent.save(function (err) { if (err) console.log('Error on save!') });

        res.sendFile(__dirname+"/EventPosted.html");
    });

    events.get("/ListEvents", function (req, res) { //LISTS ALL Teams IN THE DATABASE
        
        eventModel.find(function (err, event) {
            
            if (err) return console.error(err);
            
            console.log(event);
            
            res.send({ event });
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
                    eventModel.updateOne({ eventID: eventID },{$set: { "totalNumberVotedString" : event.totalNumberVoted.toString() }}, function (error, result) {
                        if (error) res.send(error);
                    });                    
                    eventModel.updateOne({ eventID: eventID },{$set: { "numberVotedForString" : event.numberVotedFor.toString() }}, function (error, result) {
                        if (error) res.send(error);
                    });
                    eventModel.updateOne({ eventID: eventID },{$set: { "numberVotedAgainstString" : event.numberVotedAgainst.toString() }}, function (error, result) {
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
                    eventModel.updateOne({ eventID: eventID },{$set: { "totalNumberVotedString" : event.totalNumberVoted.toString() }}, function (error, result) {
                        if (error) res.send(error);
                    });                    
                    eventModel.updateOne({ eventID: eventID },{$set: { "numberVotedAgainstString" : event.numberVotedAgainst.toString() }}, function (error, result) {
                        if (error) res.send(error);
                    });                    
                    eventModel.updateOne({ eventID: eventID },{$set: { "numberVotedForString" : event.numberVotedFor.toString() }}, function (error, result) {
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