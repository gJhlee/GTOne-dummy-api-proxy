function rabbits (param) {
    let count = 12;
    let result = [];
    while (count-- > 0) {
        let rabbit = {
            "id": "Rabbit-#" + count,
            "name" : (count%2? "Mr." : "Mrs.") + "Rabbit-#"+count
        }
        result.push(rabbit);
    }
    return result;
}

module.exports = {
    default: rabbits
}