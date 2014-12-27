var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "qqq@gmail.com",
        pass: "qqq"
    }
});

var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.get('/',function(req,res){
	res.sendfile(__dirname + '/public/index.html');
});

var getZDay = function(d) {
	if (d==="7") return "7 дней";
	if (d==="14") return "14 дней";
	if (d==="0") return "другое";
	return "не введено";
}

var getEducation = function(e) {
	if (e==="1") return "среднее";
	if (e==="2") return "высшее";
	if (e==="3") return "незаконченное высшее";
	if (e==="4") return "два и более высших / ученая степень";
	return "не введено";
}

var getDriveLic = function(e) {
	if (e==="0") return "да";
	if (e==="1") return "нет";
	return "не введено";
}

var getHomeOwner =function(e,i) {
	if (e==="0") return "Собственное жилье";
	if (e==="1") return "Социальный найм";
	if (e==="2") return "Коммерческий найм";
	if (e==="3") return "У родственников";
	if (e==="4") return "Иное: "+i;
	
	return "не введено";
}
 
var getFamilyState = function(e) {
	if (e==="0") return "женат/замужем";
	if (e==="1") return "холост/не замужем";
	if (e==="2") return "разведен(а)";
	if (e==="3") return "вдовец/вдова";

	return "не введено";
}

var getWorkState = function(e) {
	if (e==="0") return "работа по найму/служба";
	if (e==="1") return "домохозяйка";
	if (e==="2") return "пенсионер";
	if (e==="3") return "собственное дело";
	if (e==="4") return "студент";
	if (e==="5") return "безработный";

	return "не введено";
}

var getNoYesInSum = function(e) {
	if (e==="0") return "нет";
	if (e==="1") return "есть в сумме";
	return "не введено";
}

var getNoYes = function(e) {
	if (e==="0") return "нет";
	if (e==="1") return "да";
	return "не введено";
}

app.post('/send',function(req,res){
	console.log(req.body.zsum);
	html_str="<h1 style='text-align: center'>Анкета заемщика-физического лица</h1>"+
             "<h6 style='text-align: center'>Анкета заполняется клиентом для дальнейшего сотрудничества</h6>"+
             "<h6 style='text-align: center'>с ИП Окружной А.Б.</h6>"+
    "<table border='1'>"+
		"<tr><td><h3>ЗАПРАШИВАЕМЫЙ ЗАЙМ</h3></td></tr>"+
		"<tr><td><h5>Запрашиваемая сумма займа (руб.)</h5></td><td>"+req.body.zsum+"</td></tr>"+
		"<tr><td><h5>Цель займа</h5></td><td>"+req.body.zaim+"</td></tr>"+
		"<tr><td><h5>Срок займа</h5></td><td>"+getZDay(req.body.zDays)+"</td></tr>"+
		"<tr><td><h3>ПЕРСОНАЛЬНЫЕ ДАННЫЕ ЗАЕМЩИКА</h3></td></tr>"+
		"<tr><td><h5>Фамилия Имя Отчество</h5></td><td>"+req.body.fio+"</td></tr>"+
		"<tr><td><h5>Дата рождения</h5></td><td>"+req.body.birthdate+"</td></tr>"+
		"<tr><td><h5>Место рождения</h5></td><td>"+req.body.birthplace+"</td></tr>"+
		"<tr><td><h5>Гражданство</h5></td><td>"+req.body.citizen+"</td></tr>"+
		"<tr><td><h5>Образование</h5></td><td>"+getEducation(req.body.educ)+"</td></tr>"+
		"<tr><td><h5>Имеете ли вы водительские права?</h5></td><td>"+getDriveLic(req.body.drivelic)+"</td></tr>"+
		"<tr><td><h5>Паспорт</h5></td><td><table>"+
			"<tr><td>Серия</td><td>"+req.body.pasportser+"</td></tr>"+
			"<tr><td>Номер</td><td>"+req.body.pasportnum+"</td></tr>"+
			"<tr><td>Дата выдачи</td><td>"+req.body.pasportdate+"</td></tr>"+
			"<tr><td>Кем выдан</td><td>"+req.body.pasportkem+"</td></table><tr>"+
		"<tr><td><h5>Адрес постоянной регистрации</h5></td><td>"+req.body.addresspostreg+"</td></tr>"+
		"<tr><td>"+getHomeOwner(req.body.homeownerstate, req.body.homeothertext)+"</td></tr>"+
		"<tr><td><h5>Адрес фактического проживания</h5></td><td>"+req.body.addressfact+"</td></tr>"+
		"<tr><td>"+getHomeOwner(req.body.fhomeownerstate, req.body.fhomeothertext)+"</td></tr>"+
		"<tr><td><h5>Домашний телефон</h5></td><td>"+req.body.homephone+"</td></tr>"+
		"<tr><td><h5>Мобильный телефон</h5></td><td>"+req.body.cellphone+"</td></tr>"+
		"<tr><td><h5>Рабочий телефон</h5></td><td>"+req.body.workphone+"</td></tr>"+
		"<tr><td><h3>ДАННЫЕ О СЕМЬЕ</h3></td></tr>"+
		"<tr><td><h5>Семейное положение</h5></td><td>"+getFamilyState(req.body.famstate)+"</td></tr>"+
		"<tr><td><h5>ФИО супруга(и), дата рождения, контактный телефон</h5></td><td>"+req.body.suprfio+"</td></tr>"+
		"<tr><td><h5>Место работы супруга(и), должность</h5></td><td>"+req.body.suprwork+"</td></tr>"+
		"<tr><td><h5>Состав семьи, количество</h5></td><td>"+req.body.famcount+"</td><td><h5>Из них детей</h5></td><td>"+req.body.childcount+"</td></tr>"+
		"<tr><td><h5>ФИО родителей, место работы,должность,контактный телефон</h5></td><td><h5>Мать:</h5></td><td>"+req.body.mather+"</td><td><h5>Тел.:</h5></td><td>"+req.body.matherphone+"</td></tr>"+
		"<tr><td></td><td><h5>Отец:</h5></td><td>"+req.body.father+"</td><td><h5>Тел.:</h5></td><td>"+req.body.fatherphone+"</td></tr>"+
		"<tr><td><h3>КОНТАКТНАЯ ИНФОРМАЦИЯ ЛИЦА ДЛЯ СРОЧНОЙ СВЯЗИ С ВАМИ</h3></td></tr>"+
		"<tr><td><h5>1.Фамилия Имя Отчество</h5></td><td>"+req.body.contact1+"</td></tr>"+
		"<tr><td><h5>Степень родства</h5></td><td>"+req.body.contact1rod+"</td></tr>"+
		"<tr><td><h5>Контактный телефон</h5></td><td>"+req.body.contact1cell+"</td></tr>"+
		"<tr><td><h5>2.Фамилия Имя Отчество</h5></td><td>"+req.body.contact2+"</td></tr>"+
		"<tr><td><h5>Степень родства</h5></td><td>"+req.body.contact2rod+"</td></tr>"+
		"<tr><td><h5>Контактный телефон</h5></td><td>"+req.body.contact2cell+"</td></tr>"+
		"<tr><td><h3>ДАННЫЕ О РАБОТЕ</h3></td></tr>"+
		"<tr><td><h5>Тип занятости</h5></td><td>"+getWorkState(req.body.workstate)+"</td></tr>"+
		"<tr><td><h5>Название организации/вид деятельности</h5></td><td>"+req.body.firmname+"</td></tr>"+
		"<tr><td><h5>Адрес организации</h5></td><td>"+req.body.firmaddress+"</td></tr>"+
		"<tr><td><h5>Телефон организации/рабочий мобильный телефон</h5></td><td>"+req.body.firmphone+"</td></tr>"+
		"<tr><td><h5>Должность</h5></td><td>"+req.body.dolzhnost+"</td></tr>"+
		"<tr><td><h5>Стаж по текущему месту работы</h5></td><td>"+req.body.stazh+"</td><td><h5>Общий трудовой стаж (лет)</h5></td><td>"+req.body.stazhall+"</td></tr>"+
		"<tr><td><h3>СРЕДНЕМЕСЯЧНЫЕ ДОХОДЫ И РАСХОДЫ</h3></td></tr>"+
		"<tr><td><h3>Среднемесячные доходы за последние 3 месяца:</h3></td></tr>"+
		"<tr><td><h5>По основному месту работы</h5></td><td>"+req.body.poosnmesturaboty+"</td><td><h5>Сдача в аренду недвижимости</h5></td><td>"+req.body.arenda+"</td></tr>"+
		"<tr><td><h5>По совместительству</h5></td><td>"+req.body.posovmestit+"</td><td><h5>Проценты,дивиденты</h5></td><td>"+req.body.procdiv+"</td></tr>"+
		"<tr><td><h5>Пенсия</h5></td><td>"+req.body.pensiya+"</td><td><h5>Прочие (указать какие)</h5></td><td>"+req.body.proch+"</td></tr>"+
		"<tr><td><h5>Доход других членов семьи (указать какие)</h5></td><td>"+req.body.dohdrugihchlenovsem+"</td></tr>"+
		"<tr><td><h3>Среднемесячные расходы за последние 3 месяца:</h3></td></tr>"+
		"<tr><td><h5>Коммунальные платежи</h5></td><td>"+req.body.commplat+"</td><td><h5>Питание</h5></td><td>"+req.body.pitanie+"</td></tr>"+		
		"<tr><td><h5>Кредиты</h5></td><td>"+req.body.credits+"</td><td><h5>Обучение</h5></td><td>"+req.body.obuchenie+"</td></tr>"+		
		"<tr><td><h3>ИНФОРМАЦИЯ О НАЛИЧИИ СОБСТВЕННОСТИ И ДРУГИХ АКТИВОВ</h3></td></tr>"+
		"<tr><td><h5>Недвижимость(дом,квартира,комната,дача,земля), указать адрес</h5></td><td>"+req.body.nedvizhimost+"</td></tr>"+
		"<tr><td><h5>Транспорт (модель, год выпуска)</h5></td><td>"+req.body.transp+"</td></tr>"+
		"<tr><td><h5>Средства на банковских счетах</h5></td><td>"+req.body.srbank+"</td></tr>"+
		"<tr><td><h5>Другие ликвидные активы</h5></td><td>"+req.body.likvact+"</td></tr>"+
		"<tr><td><h3>ИНФОРМАЦИЯ О НАЛИЧИИ ОБЯЗАТЕЛЬСТВ</h3></td></tr>"+
		"<tr><td><h5>Действующие кредиты (кредитор,размер,срок,дата получения,размер платежа)</h5></td><td>"+req.body.deystvcred+"</td></tr>"+
		"<tr><td><h5>Алименты</h5></td><td>"+getNoYesInSum(req.body.aliment)+"</td></tr>"+
		"<tr><td><h5>Удержание по решению суда</h5></td><td>"+getNoYesInSum(req.body.sud)+"</td></tr>"+
		"<tr><td><h5>Прочие выплаты</h5></td><td>"+getNoYesInSum(req.body.prochvipl)+"</td></tr>"+
		"<tr><td><h3>ДРУГИЕ СВЕДЕНИЯ</h3></td></tr>"+
		"<tr><td><h5>Имеются ли решения суда, которые Вы не исполнили?</h5></td><td>"+getNoYes(req.body.reshsud)+"</td></tr>"+
		"<tr><td><h5>Находитесь ли Вы под судом или следствием?</h5></td><td>"+getNoYes(req.body.podsudom)+"</td></tr>"+
		"<tr><td><h5>Предъявлены ли к Вам иски в порядке гражданского судопроизводства?</h5></td><td>"+getNoYes(req.body.grisk)+"</td></tr>"+
		"<tr><td><h5>Привлекались ли Вы к уголовной ответственности?</h5></td><td>"+getNoYes(req.body.ugotvet)+"</td></tr>"+
		"<tr><td><h5>Существуют ли решения суда об ограничении Вашей дееспособности?</h5></td><td>"+getNoYes(req.body.ogrdeesp)+"</td></tr>"+
		"<tr><td><h5>Имеются ли у Вас просроченные кредиты?</h5></td><td>"+getNoYes(req.body.credprosroch)+"</td></tr>"+
		"<tr><td><h5>Являетесь ли Вы инвалидом I или II группы?</h5></td><td>"+getNoYes(req.body.invalid)+"</td></tr>"+
		"<tr><td><h5>Если Вы ответили 'Да' на любой из вышеперечисленных вопросов, предоставьте дополнительную информацию:?</h5></td><td>"+req.body.dopinfo+"</td></tr>"+
		"<tr><td><h3>КАК ВЫ УЗНАЛИ ПРО НАС?</h3></td><td>"+req.body.pronas+"</td></tr>"+
		"</table></td></tr>"+
	"</table>";

	var mailOptions = {
    	from: "Заявка на кредит ✔ <info@phreebie.net>", // sender address
    	to: "juhnowski@gmail.com, kirill.a.gusev@gmail.com", // juhnowski@gmail.com, baz@blurdybloop.com
    	subject: "Заявка на кредит ✔", // Subject line
    	text: html_str, // plaintext body
    	html: html_str // html body
	}
	
	smtpTransport.sendMail(mailOptions, function(error, response){
    	if(error){
        	console.log(error);
    	}else{
        	console.log("Заявка на предоставление кредита отправлена."); //response.message
    	}

//    	smtpTransport.close(); // shut down the connection pool, no more messages
	});
	res.send('Request has been sent');
});

app.use(function(err,req,res,next){
	console.error(err.stack);
	res.send(500,'Something broke')
});

var server = app.listen(3000, function(){
	console.log("Listening on port %d", server.address().port);
});
