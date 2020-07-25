const jwt = require("jsonwebtoken");
const config = require("config");

// определим функцию которая будет этим самым middleware
// req - объект запроса
// reы - объект ответа
// next
module.exports = (req, res, next) =>{
  // из заголовка запроса получаем токен "auth-token" – внутри его токен
  // так у объекта запроса, мы с помощью метода header получим содержимое
  const token = req.header("auth-token");

  //далее мы смотрим, если токена вообще нету (юзер не зареган),
  if(!token){
    return res.status(401).json({msg:"No token, authrolizatoin denied"});
    // если его нет, прокинем 401 ошибку
    // сообщаем в формате json, объектом, со свойством msg: "токена нет, не получишь данные"
  }
  // оборачиваем в try/catch, если вернётся ошибка, то обработаем её, 
  //если всё гуд, то попадёт в try
  try{
    // если всё нормльно, то мы раздекодируем токен.
    // создадим переменную, где будем хранить инфу о раздекодированом токене
    // у jwt есть метод спеиальный verify (токен, секрет по которому декодировали)
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // если всё гуд, то мы в объект req положим свойство user, со значением decoded.user
    req.user = decoded.user;
  }catch(err){
    // если вохникла ошибка
    // return пишем когда нужно полностью выйти из кода уже
    return res.status(401).json({msg: "Token is not valid"})
  }

}
