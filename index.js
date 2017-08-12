
// Class for our form logic
function Form(formName, inputNames, anotherElementIds=[], debug=false) {

    // Patterns to check various fields
    const patterns = {
        'fio': /^[А-Я][а-я]+ [А-Я][а-я]+ [А-Я][а-я]+$/,
        'email': /^[a-zA-Z0-9._+-]+@(ya\.ru|(yandex\.(ru|ua|by|kz|com)))$/,
        'phone': /^\+7\([0-9]+\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/,
    };

    // Various magic numbers
    const maxPhoneSum = 30
    const submitBtnId = 'submitBtn'
    const messageDivId = 'resultContainer'
    const zero = 48  // ord('0')

    // Validate data fields against patterns and specific constraints
    this.validate = () => {
        let errors = this.inputNames.filter((name) => {
            return this.elements[name].value.match(patterns[name]) == null
        });
        // Sum of numbers in phone should not be greater than maxPhoneSum
        if (!(errors.includes('phone'))) {
            let phone = this.elements['phone'].value
            let sum = phone.split('').reduce((acc, letter, i) => {
                let num = phone.charCodeAt(i) - zero
                if (num >= 0 && num <= 9)
                    return acc+num
                return acc
            }, 0)
            if (sum > maxPhoneSum)
                errors.push('phone')
        }
        return {isValid: (errors.length == 0), errorFields: errors}
    };

    // Return form data as object
    this.getData = () => {
        return this.inputNames.reduce((acc, name) => {
            acc[name] = this.elements[name].value
            return acc
        }, {})
    };

    // Take "element: data" object and set fields' values
    this.setData = (data) => {
        for (let name in data) {
            if (data.hasOwnProperty(name))
                this.elements[name].value = data[name]
        }
    };

    // Check form and send data to server
    this.submit = (e) => {
        e.preventDefault()
        for (let name of this.inputNames) {
            this.elements[name].className = ''
        }
        let validation = this.validate()
        if (validation.isValid) {
            this.elements[submitBtnId].disabled = true
            if (this.debug)
                this.fetchData(this.getURL())
            else
                this.fetchData(this.form.action)
        }
        else {
            for (let name of validation.errorFields) {
                this.elements[name].className = 'error'
            }
        }
    };

    // Send data to server by url
    this.fetchData = (url) => {
        var self = this
        fetch(url).then((response) => {
            return response.json()
        }).then((data) => {
            switch (data.status ) {
                case 'success': 
                    self.showMessage('Success', 'success')
                    this.elements[submitBtnId].disabled = false
                    break
                case 'error':
                    self.showMessage(data.reason, 'error')
                    this.elements[submitBtnId].disabled = false
                    break
                case 'progress':
                    self.showMessage('Waiting...', 'progress')
                    if (this.debug)
                        setTimeout(() => {this.fetchData(this.getURL())}, data.timeout)
                    else
                        setTimeout(() => {this.fetchData(url)}), data.timeout
                    break
                default:
                    console.log('Что-то пошло не так: '+data.status)
                    this.elements[submitBtnId].disabled = false
            }
        })
    }

    // Random URL, for testing only
    this.getURL = () => {
        return ['responses/error.json', 'responses/success.json', 'responses/progress.json'][Math.floor(Math.random() * 3)]
    }

    // Set resultContainer message
    this.showMessage = (message, status=null) => {
        if (status != null)
            this.elements[messageDivId].className = status
        this.elements[messageDivId].innerText = message
    }

    // Constructor
    this.init = (formName, inputNames, anotherElementIds, debug) => {
        this.debug = debug
        this.elements = {}
        this.form = document.forms[formName];
        this.inputNames = inputNames
        this.elements = {}
        for (let name of inputNames)
            this.elements[name] = this.form.elements[name]
        for (let elementId of anotherElementIds)
            this.elements[elementId] = document.getElementById(elementId)
        this.form.addEventListener('submit', this.submit)
    };

    // Initialize our form
    this.init(formName, inputNames, anotherElementIds, debug)
}
