function rabbits (param) {
    let count = 50;
    let root = {
        "id": "Rabbit-Root",
        "name": "Rabbit-Master",
        "children": []
    };
    let rabbitList = [root];
    while (count-- > 0) {
        let randomParent = rabbitList[Math.round(Math.random() * (rabbitList.length-1))];
        let rabbit = {
            "id": "Rabbit-#" + count,
            "name": (count % 2 ? "Mr." : "Mrs.") + "Rabbit-#" + count,
            "children": []
        }
        rabbitList.push(rabbit)
        randomParent.children.push(rabbit);
    }
    return root;
}

module.exports = {
    default: rabbits
}