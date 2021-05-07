const express=require("express")
const app=express()
const MongoClient=require("mongodb").MongoClient
const bodyParser=require("body-parser")

var db;

MongoClient.connect('mongodb://localhost:27017/BookInventory',(err,database)=>{
	if(err) return console.log(err);
	else{
		db=database.db("BookInventory")
		app.listen(3030,()=>{
			console.log("Server is listening to the port 3030");
		})
	}
})

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static("public"))

app.get('/',(req,res)=>{
	db.collection('books').find().toArray((err,result)=>{
		if(err) return console.log(err);
	res.render('home.ejs',{data:result});
	})
})

//rendering a page to add a book to db
app.get('/addBook',(req,res)=>{
	res.render('addBook.ejs');
})

//rendering a page to update details of a book
app.get('/updateBook',(req,res)=>{
	res.render('updateBook.ejs')
})


//rendering a page to delete a book
app.get('/deleteBook',(req,res)=>{
	res.render('deleteBook.ejs');
})

//post method to add a new book to db
app.post('/addBook',(req,res)=>{
	db.collection('books').save(req.body,(err,result)=>{
		if(err) return console.log(err);
		res.redirect('/');
	})
	
})

//post method to update the values of a book
app.post('/updateBook',(req,res)=>{
	db.collection('books').findOneAndUpdate({BookId:req.body.id},{
		$set:{AvailableNo:req.body.num}},{sort:{BookId:-1}},(err,result)=>{
			if(err)return console.log(err);
			console.log("1 Entry updated");
			res.redirect('/');
		})
})


//post method to delete a book in db
app.post('/deleteBook',(req,res)=>{
	db.collection('books').findOneAndDelete({BookId:req.body.id},(err,result)=>{
		if(err) return console.log(err);
		console.log("Deleted the book with bookID"+req.body.id);
	})
	res.redirect('/');
})
