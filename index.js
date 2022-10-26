if (process.NODE_ENV !== "production") {
  require('dotenv').config()
}

//================MODULOS!!================
const User = require('./models/user')
const Router = require('./models/model-routes')
const Item = require('./models/model-founds')
const Sugestion = require('./models/sugestion')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const methodOverride = require('method-override')
//================FIM DOS MODULOS================ 

const app = express()
const users = []
const itens = []
const routes = []
const sugestions = []
app.use(express.urlencoded({ extended: false }))
app.use(flash())

//================COOKIES!!================
const SESSION_SECRET = 'secret'
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }//30 MIN!
}))
app.use(passport.initialize())
app.use(passport.session())
//================COOKIES!!================

app.use(methodOverride('_method'))


//================INFO DATABASE================

const dbUser = 'Rekcahel'
const dbPassword = 'ga8gwfZ715E9mjVQ'
const dbHost = 'cluster0.s8gqzyw.mongodb.net/?retryWrites=true&w=majority'

//================END INFO DATABASE================

//================CONNECTION DATABASE================

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}`)
  .then(() => {
    app.listen(3000)
    console.log('Conectado ao banco de dados MongoDB na porta 3000')
  }).catch((err) => console.log(err))

//================END CONNECTION DATABASE================

//================VERIFICATION SESSION================
initializePassport(passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
//================END VERIFICATION SESSION================

//================CONFIGURATION PAGE LOGIN================
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/home_logado',
  failureRedirect: '/login',
  failureFlash: true
}))
//================END CONFIGURATION PAGE LOGIN================


//================CONFIGURATION PAGE REGISTER================
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {

    if (req.body.password != req.body.cpassword) {
      req.flash('message', "Senhas diferentes!")
    }
    if (req.body.password == null || req.body.password == undefined || req.body.password == '') {
      req.flash('message', "Campo de senha vázia")
    }
    if (req.body.name == null || req.body.name == undefined || req.body.name == '') {
      req.flash('message', "Campo de nome vazio")
    }
    if (req.body.nickname == null || req.body.nickname == undefined || req.body.nickname == '') {
      req.flash('message', "Campo de nickname vazio")
    }

    if (req.body.email == null || req.body.email == undefined || req.body.email == '') {
      req.flash('message', "Campo de email vazio")
    }
    if (req.body.phone == null || req.body.phone == undefined || req.body.phone == '') {
      req.flash('message', "Campo de telefone vazio")
    }


    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const users = new User({
      nickname: req.body.nickname,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      number: req.body.phone,
    })
    await users.save() //SALVANDO O ÚSUARIO
    res.redirect('/login') //REDIRECIONANDO PARA A PÁGINA DE LOGIN APÓS O REGISTRO CONCLUIDO
    console.log(users);
  } catch (e) {
    console.log(e); //MOSTRAR O ERRO NO CONSOLE
    res.redirect('/register') //REDIRECIONANDO PARA A MESMA PÁGINA APÓS UMA FALHA NO REGISTRO
  }
})
//================END CONFIGURATION PAGE REGISTER================

//================REGISTRO DE ITENS!!!!================
app.post('/found', async (req, res) => {
  try {
    const itens = new Item({
      item: req.body.item, 
      sala: req.body.sala,
      description: req.body.description,
      moment: req.body.moment,
})
await itens.save() //SALVANDO O ITEM
res.redirect('/achados')
  }catch (e) {
  console.log(e); //MOSTRAR O ERRO NO CONSOLE
  res.redirect('/achados') //REDIRECIONANDO PARA A MESMA PÁGINA APÓS UMA FALHA NO REGISTRO
  }
})
//================FIM DO REGISTRO DE ITENS!!!!================

//================REGISTRO DE ROTAS!!!!!================
app.post('/router', async (req, res) => {
  try {
    const routes = new Router({
      timeend: req.body.timeend, 
      begin: req.body.begin,
      end: req.body.end,
      number: req.user.number,
      name: req.user.name,
})
await routes.save() //SALVANDO O ITEM
res.redirect('/caronas')
  }catch (e) {
  console.log(e); //MOSTRAR O ERRO NO CONSOLE
  res.redirect('/caronas') //REDIRECIONANDO PARA A MESMA PÁGINA APÓS UMA FALHA NO REGISTRO
  }
})
//================FIM DO REGISTRO DE ROTAS!!!!================

//================REGISTRO DE SUGESTÕES!!!!!================
app.post('/sugestion', async (req, res) => {
  try {
    const sugestions = new Sugestion({
      sugestion: req.body.sugestion, 
      name: req.user.name,
})
await sugestions.save() //SALVANDO A SUGESTÃO
res.redirect('/home_logado')
  }catch (e) {
  console.log(e); //MOSTRAR O ERRO NO CONSOLE
  res.redirect('/home_logado') //REDIRECIONANDO PARA A MESMA PÁGINA APÓS UMA FALHA NO REGISTRO
  }
})
//================FIM DO REGISTRO DE SUGESTÕES!!!!================

//================Visialização arquivo JS/CSS
app.use(express.static("views"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
//================Visialização arquivo JS/CSS================


//================ ROUTES================
app.get("/", checkNotAuthenticated, function(req, res) {
  res.render(__dirname + "/views/home.ejs")
})
app.get("/home_logado", checkAuthenticated, function(req, res) {
  res.render(__dirname + "/views/home_logado.ejs")
})
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('../views/cadastro/cadastro.ejs', { message: req.flash('message') })
})
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('../views/cadastro/login.ejs')
})
app.get('/caronas', checkAuthenticated, (req, res) => {
  Router.find({}, function(err, routes){
res.render('../views/pages/caronas.ejs', {
  RoutesList: routes,
})
  })
})
app.get('/crush', checkAuthenticated, (req, res) => {
  res.render('../views/pages/crush.ejs')
})
app.get('/achados', checkAuthenticated, (req, res) => {
  Item.find({}, function(err, itens){
res.render('../views/pages/achados.ejs', {
  ItemList: itens,
})
  })
})
app.get('/games', checkAuthenticated, (req, res) => {
  res.render('../views/pages/games.ejs')
})
app.get('/perfil', checkAuthenticated,(req, res) => {
  res.render('../views/pages/perfil.ejs', {
    name: req.user.name,
    number: req.user.number,
    id: req.session.passport.user,
    nickname: req.user.nickname,
    email: req.user.email,
  }
  )
})
app.get('/users', async (req, res) => { 
  User.find({}, function(err, users){
res.render('../views/users.ejs', {
  UserList: users
})})})

//================LOGOUT!!================ 
app.delete("/logout", (req, res) => {
  req.logout(req.user, err => {
    if (err) return next(err)
    res.redirect('/login')
  })
})
//================LOGOUT!!================


//================FUNCTIONS VERIFICATION AUTHENTICATION!! MIDDLEWARE!!================
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/home_logado")
  }
  next()
}
//================END FUNCTIONS VERIFICATION AUTHENTICATION!! MIDDLEWARE!!================
