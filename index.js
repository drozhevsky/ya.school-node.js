

function Form(formName, inputNames) {

    let patterns = {
        'fio': /\w+ \w+ \w+/,
        'email': /[a-zA-Z0-9.+@]+@(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com)/,
        'phone': /\+7\([0-9]+\)[0-9]{3}-[0-9]{2}-[0-9]{2}/,
    };

    this.validate = () => {
        let errors = this.inputNames.filter((name) => {
            return this.elements[name].value.match(patterns[name]) == null
        }, []);
        return {isValid: (errors.length == 0), errorFields: errors}
    };

    this.getData = () => {
        return this.inputNames.reduce((acc, name) => {
            acc[name] = this.elements[name].value
            return acc
        }, {})
    };

    this.setData = (data) => {
        this.inputNames.map((name) => {
            if (data.hasOwnProperty(name))
                this.elements[name].value = data[name]
        })
    };

    this.submit = (e) => {
        e.preventDefault()
        let validation = this.validate()
        if (validation.isValid)
            console.log('Its okay, can send data')
        else
            console.log('Somethings wrong...')
    };

    this.init = (formName, inputNames) => {
        this.elements = {}
        this.form = document.forms[formName];
        this.inputNames = inputNames
        this.elements = this.inputNames.reduce((acc, name) => {
            acc[name] = this.form.elements[name]
            return acc
        }, {})
        this.form.addEventListener('submit', this.submit)
    };

    this.init(formName, inputNames)
}

function onload(){
    var MyForm = new Form('myForm', ['fio', 'email', 'phone'])
}
