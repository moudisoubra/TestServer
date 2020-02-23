function News(news, mongoose)
{
    var newsSchema = new mongoose.Schema({
        newsTitle: String,
        newsContent: String,
        newsID: String
    });

    var newsModel = mongoose.model('news', newsSchema);

    console.log("News Server Started");

    news.get("/newsPage", function(req, res)
    {
        res.sendFile(__dirname+"/newsPage.html");
    });

    news.get("/CreateNewsPost/:title/:content", function(req, res)
    {
        var title = req.params.title;
        var content = req.params.content;


        var post = new newsModel({

            "newsTitle": title,
            "newsContent": content
        });
        
        post.newsID = post._id;
        post.save(function (err) { if (err) console.log('Error on save!') });

        res.send({post});
    });

    news.post("/WebsiteNewsPost", function(req, res)
    {
        var title = req.body.newsTitle;
        var content = req.body.newsContent;


        var post = new newsModel({

            "newsTitle": title,
            "newsContent": content
        });
        
        post.newsID = post._id;
        post.save(function (err) { if (err) console.log('Error on save!') });

        res.sendFile(__dirname+"/NewsPosted.html");
    });

    news.get("/listAllNews", function (req, res) { //LISTS ALL News IN THE DATABASE
        
        newsModel.find(function (err, news) {
            
            if (err) return console.error(err);
            
            console.log(news);
            
            res.send({ news });
        });
    });

    news.get("/ClearAllNews", function (req, res) { //BIG RED BUTTON

        newsModel.remove({}, function (err) {
            console.log('News DataBase Wiped')
    
            var string = "News DataBase Wiped";
        
            res.send(string.toString());
        });
    
    });

}

module.exports = News;