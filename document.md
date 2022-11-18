In the creation of the Web Scraper i was thinking we can make an express server with mongo DB as the database.
In the server file I make use of the express, for the server, cors for cross origin access, dotenv for env variables
colors for a better dev experience.
I am invoking the connectDB() function which is an async function to connect to mongo db, and if there are errors, catch them.
I am using urlencoded and express json to take requests like from forms( i am using insomnia).I also created a custom errorMiddleware
takes takes the status code of error( if is not available it takes 500), and is sending the error message , status code and if the app
is not in production it also sends err.stack which makes it so easy to debug.
The endpoint for the ws is "/api/v1/search" which require the searchRoutes.
The searchRoutes can do the following actions scrapPages,saveForm,getMyBusiness,getForms and getKeywords which are coming from their respective
controllers.
The models i am using are formModel which take name,email and a location object which contains country,state,city and searchKyewordModel
which is taking the keyword for what google to scrap.Both are using timestamps.
The search controllers can do the following:
@saveForm - they are getting the form details from req.body , it than takes a form constant based on FormModel and it is saving it in the database.
@scrapPages - it is taking the search input from req.body.search and it is creating,saving the kyeword in the db.
-i am using a base url like this `https://www.google.com/search?q=${searchInput}` , a const with number of results(20 for first 3 pages
as first page is 0, second is 10 and third is 20) than i am creating an updated url which takes the first and a query 'start=',
i have also created a let variable which is 0 at start, and using a while loop it scrapes until current page <= max results,
and on every iteration, current page variable is take + 10.
-i am passing the url to the scrapPage function from utils.
@@scrapPage- here i make use of the axios and cheerio libraries , it is an async function that takes in a url as parameter, that url
is passed down to another async function getData() that is loading the html into cheerio with the help of axios for the provided url. - with the help of cheerio i select the title and the links of the result, i am making two arrays than combine them
into an object with link and title, and i am pushing the objects into a results array.
@getKeyword and getForms are simply a get request that use mongoose to find the forms and keywords from the database.
@getMyBusiness- this controller is taking the search input and the url `https://www.google.com/search?q=${searchInput}` and it is passed down to
@@scrapMyBusiness- again with the help of cheerio and axios , when user search for a business it will get the following details
direction,website,rating,number of reviews, address,appointment,open time, phone number and i also selected the
missing information div ( if a business has missing info, it will show up).I made an empty array of properties
where i push the info collected. And i also have myBusinessArr where i push an object with the name MyBusiness
and properties) and displaying it like this const businessDetails = myBusinessArr[0].properties .
I added the functionality for the user to select how many pages to scrap.
I added the feature, if the website has no link in data(req denied or any other reasons), instead of undefined it will not show, and added metadata , like description and keywords , this if not available will show blank, so we know what to add if necessary.
