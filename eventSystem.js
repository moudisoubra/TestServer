function EventSystem(events, mongoose)
{
    //Create Event
    //Register Event in app
    //Event Parameters : Voted For
    //                   Voted Against
    //                   Number of people Voted
    //                   List of people Voted
    //Whenever Someone votes they getted added to relative list of voted for or against and list of people voted
    //To check if someone has voted before check if they are in that list of people voted
    //If someone has voted, the event will still appear on their screen but it will appear wihtout voting allowed

    var eventSchema = new mongoose.Schema({
        eventName: String,
        eventDescription: String,
        totalNumberVoted: Number,
        numberVotedAgainst: Number,
        numberVotedFor: Number,
        likePercentage: Number
    });

    var eventModel = mongoose.model('event', eventSchema);

    console.log("Event System Started");

    events.get("/CreateEvent/:eventName/:eventDescription", function(req, res)
    {
        var eventName = req.params.eventName; 
        var eventDescription = req.params.eventDescription;


        var newEvent = new eventModel({

            "eventName": eventName,
            "eventDescription": eventDescription
        });
        
        newEvent.save(function (err) { if (err) console.log('Error on save!') });

        res.send({newEvent});
    });

    events.get("/ListEvents", function (req, res) { //LISTS ALL Teams IN THE DATABASE
        
        eventModel.find(function (err, event) {
            
            if (err) return console.error(err);
            
            console.log(event);
            
            res.send({ event });
        });
    });

    events.get("/AddToPositive/:eventName/:number", function (req, res) { //LISTS ALL Teams IN THE DATABASE
        
        var eventName = req.params.eventName;
        var points = req.params.number;
        
        eventModel.findOne({ "eventName": eventName }, (err, event) => {
            if (!event) {
                console.log("Didnt find an event with that name");
                res.send("Didnt find an event with that name");
            }
            else {

                    eventModel.updateOne({ eventName: eventName },{$inc: { numberVotedFor: points } }, function (error, result) {
                        if (error) res.send(error);
                        else res.send(result);
                    });
            }
        });

    });
}
module.exports = EventSystem;