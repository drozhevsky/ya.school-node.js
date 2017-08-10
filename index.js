

function Form(formName, inputNames, messageDivId) {

    let Patterns = {
        'fio': /[А-Я][а-я]+ [А-Я][а-я]+ [А-Я][а-я]+/,
        'email': /[a-zA-Z0-9.+@]+@(ya\.ru|(yandex\.(ru|ua|by|kz|com)))/,
        'phone': /\+7\([0-9]+\)[0-9]{3}-[0-9]{2}-[0-9]{2}/,
    };

    let ErrorMessages = {
        'fio': 'Формат ФИО: Ровно три слова.',
        'email': 'Формат E-Mail: E-Mail-адрес, но только в доменах ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com.',
        'phone': 'Формат телефона: Номер телефона, который начинается на +7, и имеет формат +7(999)999-99-99. Кроме того, сумма всех цифр телефона не должна превышать 30.',
    }

    this.validate = () => {
        let errors = this.inputNames.filter((name) => {
            return this.elements[name].value.match(Patterns[name]) == null
        }, []);
        const zero = 48  // ord('0')
        if (!(errors.includes('phone'))) {
            let phone = this.elements['phone'].value
            let sum = phone.split('').reduce((acc, letter, i) => {
                let num = phone.charCodeAt(i) - zero
                if (num >= 0 && num <= 9)
                    return acc+num
                return acc
            }, 0)
            console.log(sum)
            if (sum > 30)
                errors.push('email')
        }
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
        inputNames.map((name) => {
            this.elements[name].className = ''
        })
        let validation = this.validate()
        if (validation.isValid) {
            this.showMessage('Its okay, can send data')
        }
        else {
            validation.errorFields.map((name) => {
                this.elements[name].className = 'error'
            })
        }
    };

    this.showMessage = (message) => {
        this.elements['message'].innerText = message
    }

    this.init = (formName, inputNames) => {
        this.elements = {}
        this.form = document.forms[formName];
        this.inputNames = inputNames
        this.elements = this.inputNames.reduce((acc, name) => {
            acc[name] = this.form.elements[name]
            return acc
        }, {})
        this.elements['message'] = document.getElementById(messageDivId)
        this.form.addEventListener('submit', this.submit)
    };

    this.init(formName, inputNames)
}
