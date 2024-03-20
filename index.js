var mysql = require('mysql');
const settings = require('./settings'); 		// import the settings.js file
const databaseConfig = settings.databaseConfig; // take the MYSQL connection settings
const con = mysql.createConnection(databaseConfig);
var OwnerIp = settings.OwnerIp;
var express = require('express');
var ejs = require('ejs');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { exec } = require('child_process');
var requestIp = require('request-ip');
var app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.engine('.ejs', ejs.__express);
app.set('views',__dirname+'/views');
app.use(session({
	secret: settings.secret,
	resave: false,
	saveUninitialized: false
}));

app.get('/', function(req, response) {
	var clientIp = requestIp.getClientIp(req);
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get("/anasayfa", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	var sorgu = con.query('SELECT * FROM accounts;',function(err,result){
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
				res.render('anasayfa.ejs', {
				});
		}
		else if (request.session.loggedin) {
				res.render('anasayfa.ejs', {
				});
		} else {
			res.send('Lütfen giriş yapın');
		}
		res.end();
	});
});
app.get("/main", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	var sorgu = con.query('SELECT * FROM accounts;',function(err,result){
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
				res.render('main.ejs', {
				});
		}
		else if (request.session.loggedin) {
					res.render('main.ejs', {
					});
		} else {
			res.send('Lütfen giriş yapın');
		}
		res.end();
	});
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/main');
			} else {
				response.send('Yanlış kullanıcı adı veya şifre');
			}			
			response.end();
		});
	} else {
		response.send('Lütfen kullanıcı adı ve şifre gir !');
		response.end();
	}
});
app.get("/players", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	var sorgu = con.query('select  `u`.`id` AS `ID`,`u`.`citizenid` AS `Citizen_ID`,`u`.`money` AS `Nakit_Para`,`u`.`name` AS `Isim`,`u`.`job` AS `Iş`,`u`.`phone` AS `Telefon` from `players` `u` GROUP BY id DESC',function(err,result){
		 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('players.ejs', {
				players: result
			});
		}
		else if (request.session.loggedin) {
			res.render('players.ejs', {
				players: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}		
		res.end();
	});
});
app.get("/accounts", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	var sorgu = con.query('SELECT * FROM `accounts`',function(err,result){
		 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('accounts.ejs', {
				players: result
			});
		}
		else if (request.session.loggedin) {
			res.render('accounts.ejs', {
				players: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}		
		res.end();
	});
});

app.get("/transaction_history", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM transaction_history; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('transaction_history.ejs', {
				transaction_history: result
			});
		}
		else if (request.session.loggedin) {
			res.render('transaction_history.ejs', {
				transaction_history: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});
app.get("/player_contacts", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM player_contacts; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('player_contacts.ejs', {
				player_contacts: result
			});
		}
		else if (request.session.loggedin) {
			res.render('player_contacts.ejs', {
				player_contacts: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});

app.get("/player_houses", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM player_houses; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('player_houses.ejs', {
				player_houses: result
			});
		}
		else if (request.session.loggedin) {
			res.render('player_houses.ejs', {
				player_houses: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});

app.get("/player_crops", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM player_crops; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('player_crops.ejs', {
				player_crops: result
			});
		}
		else if (request.session.loggedin) {
			res.render('player_crops.ejs', {
				player_crops: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});
app.get("/player_vehicles", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM player_vehicles; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('player_vehicles.ejs', {
				player_vehicles: result
			});
		}
		else if (request.session.loggedin) {
			res.render('player_vehicles.ejs', {
				player_vehicles: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});

app.get("/phone_messages", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM phone_messages; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('phone_messages.ejs', {
				phone_messages: result
			});
		}
		else if (request.session.loggedin) {
			res.render('phone_messages.ejs', {
				phone_messages: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});
app.get("/phone_tweets", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM phone_tweets; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('phone_tweets.ejs', {
				phone_tweets: result
			});
		}
		else if (request.session.loggedin) {
			res.render('phone_tweets.ejs', {
				phone_tweets: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});
app.get("/player_mails", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM player_mails; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('player_mails.ejs', {
				player_mails: result
			});
		}
		else if (request.session.loggedin) {
			res.render('player_mails.ejs', {
				player_mails: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});
app.get("/phone_chatrooms", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM phone_chatrooms; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('phone_chatrooms.ejs', {
				phone_chatrooms: result
			});
		}
		else if (request.session.loggedin) {
			res.render('phone_chatrooms.ejs', {
				phone_chatrooms: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});

app.get("/phone_chatroom_messages", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM phone_chatroom_messages; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('phone_chatroom_messages.ejs', {
				phone_chatroom_messages: result
			});
		}
		else if (request.session.loggedin) {
			res.render('phone_chatroom_messages.ejs', {
				phone_chatroom_messages: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});
app.get("/phone_gallery", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM phone_gallery; ',function(err,result){	 
		if (err){	
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('phone_gallery.ejs', {
				phone_gallery: result
			});
		}
		else if (request.session.loggedin) {
			res.render('phone_gallery.ejs', {
				phone_gallery: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});
app.get("/crypto", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM crypto; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('crypto.ejs', {
				crypto: result
			});
		}
		else if (request.session.loggedin) {
			res.render('crypto.ejs', {
				crypto: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});
app.get("/crypto_transactions", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM crypto_transactions; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('crypto_transactions.ejs', {
				crypto_transactions: result
			});
		}
		else if (request.session.loggedin) {
			res.render('crypto_transactions.ejs', {
				crypto_transactions: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});

app.get("/whitelist", function(request,res,next) {
	var clientIp = requestIp.getClientIp(request);
	const table = request.params.table;
	var sorgu = con.query('SELECT * FROM whitelist; ',function(err,result){	 
		if (err){
			return next(err)
		}
		else if (clientIp == OwnerIp) {
			res.render('whitelist.ejs', {
				whitelist: result
			});
		}
		else if (request.session.loggedin) {
			res.render('whitelist.ejs', {
				whitelist: result
			});
		} else {
			res.send('Sayfayi goruntulemek icin lutfen giris yapiniz. ');
		}
		res.end();
	});
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/ekle/whitelist', function (req, res, next) {
    const identifier = req.body.identifier;
    const currentDate = new Date();
    const query = "INSERT INTO whitelist (identifier, lastchanged) VALUES (?, ?)";
    con.query(query, [identifier, currentDate], function (err, result) {
        if (err) {
            return res.status(500).json({ success: false, message: "Veri ekleme sırasında bir hata oluştu." });
        }
        return res.status(200).json({ success: true, message: "Veri başarıyla eklendi." });
    });
});

app.post('/sil/:table', function (req, res) {
    const table = req.params.table;
    const itemID = req.body.itemID;
	//console.log("TABLE NAME "+ table)
	//console.log("itemID NAME "+ itemID)
    const deleteQuery = `DELETE FROM ${table} WHERE id = ?`;
    con.query(deleteQuery, [itemID], function (error, result) {
        if (error) {
            res.status(500).send('Veri silinirken bir hata oluştu: ' + error);
        } else {
            res.redirect(`/${table.toLowerCase()}`);
        }
    });
});

app.post('/sil/hepsini/:tableName', function(req, res, next) {
    var tableName = req.params.tableName;
    var query = "DELETE FROM " + tableName;
    con.query(query, function(err, result) {
        if (err) {
            return res.status(500).send("Hepsini silme işlemi sırasında bir hata oluştu.");
        }
        
        // Silme işlemi tamamlandığında JavaScript ile sayfayı yenileme
        return res.status(200).send("<script>location.reload();</script>");
    });
});

app.get("/duzenle/:table/:id", function(request, res, next) {
    const table = request.params.table;
    const id = request.params.id;
    con.query(`SELECT * FROM ${table} WHERE id = ?;`, [id], function(err, result) {
        if (err) {
            return next(err);
        } else if (request.session.loggedin) {
            if (result.length === 0) {
                return res.send('Düzenlemek için geçerli bir işlem yok.');
            }
            res.render('duzenle.ejs', {
                table: table,
                data: result[0]
            });
        } else {
            res.send('Sayfayı görüntülemek için lütfen giriş yapınız.');
        }
    });
});

app.post('/kaydet/:table/:id', function (request, response, next) {
	const table = request.params.table;
	const id = request.params.id;
	const updateData = request.body;
  
	// SQL sorgusu için SET ifadesini oluşturun
	let setQuery = '';
	for (const key in updateData) {
	  if (key !== 'id') {
		setQuery += `${key} = '${updateData[key]}', `;
	  }
	}
	setQuery = setQuery.slice(0, -2); // Son iki karakteri kaldırın (sondaki virgül ve boşluk)
	con.query(`UPDATE ${table} SET ${setQuery} WHERE id = ?`, [id], function (err, result) {
		if (err) {
            return res.status(500).send("Kaydetme Sırasında Hata oluştu");
        }
		response.json({ message: 'Veri başarıyla güncellendi.' });
    }); 
});
con.connect((err) => {
	if (err) throw err;
	console.log('Successfully connected to MySQL database.');
});

app.listen(3000,function(){
console.log("")
console.log("\x1b[31m WEBLOG ")
console.log("\033[1;37mLog in to the tab from your browser by typing \033[1;32mlocalhost:3000 \033[1;37")
});

/*
   _____         _     _                  _    
  / ____|       | |   | |                | |   
 | |  __   ___  | | __| |__    ___  _ __ | | __
 | | |_ | / _ \ | |/ /| '_ \  / _ \| '__|| |/ /
 | |__| || (_) ||   < | |_) ||  __/| |   |   < 
  \_____| \___/ |_|\_\|_.__/  \___||_|   |_|\_\                                                                                  
*/ 