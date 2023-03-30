const PythonIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'section', 'selected_integration', 'is_selected', 'integration_data'],
    emits: ['set_data', 'clear_data'],
    data() {
        return this.initialState()
    },
    computed: {
        body_data() {
            let {
                description,
                is_default,
                selected_integration: id,
                save_intermediates_to,
                requirements,
            } = this
            requirements = this.convertStrToList(requirements)
            return {
                description,
                is_default,
                id,
                save_intermediates_to,
                requirements,
            }
        },
    },
    watch: {
        selected_integration(newState, oldState) {
            console.debug('watching selected_integration: ', oldState, '->', newState, this.integration_data)
            this.set_data(this.integration_data?.settings, false)
        }
    },
    methods: {
        convertStrToList(str){
            if (typeof str != "string")
                return str 

            if (str.trim()==""){
                return null
            }
            return str.split(',').map(x => x.trim())
        },

        convertListToStr(value){
            if (!value) 
                return null
            
            isNotArray = !Array.isArray(value)
            if (isNotArray)
                return value
            
            return value.join(", ")
        },

        get_data() {
            if (this.is_selected) {
                return this.body_data
            }
        },
        set_data(data, emit = true) {
            Object.assign(this.$data, data)
            emit&& this.$emit('set_data', data)
        },
        clear_data() {
            Object.assign(this.$data, this.initialState())
            this.$emit('clear_data')
        },

        handleError(response) {
            try {
                response.json().then(
                    errorData => {
                        errorData.forEach(item => {
                            console.debug('python item error', item)
                            this.error = {[item.loc[0]]: item.msg}
                        })
                    }
                )
            } catch (e) {
                alertCreateTest.add(e, 'danger-overlay')
            }
        },

        initialState: () => ({
            // toggle: false,
            error: {},
            save_intermediates_to: '/data/intermediates/sast',
            requirements: "requirements.txt",
        })
    },
    template: `
        <div class="mt-3">
            <div class="row">
                <div class="col">
                    <h7>Advanced Settings</h7>
                    <p>
                        <h13>Integration default settings can be overridden here</h13>
                    </p>
                </div>
            </div>
            <div class="form-group">
                <form autocomplete="off">
                    <h9>Save intermediates to</h9>
                    <p>
                        <h13>Optional</h13>
                    </p>
                    <input type="text" class="form-control form-control-alternative"
                        placeholder=""
                        v-model="save_intermediates_to"
                        :class="{ 'is-invalid': error.save_intermediates_to }">
                    <div class="invalid-feedback">[[ error.save_intermediates_to ]]</div>

                    <h9>Requirements</h9>
                    <p>
                        <h13>Optional</h13>
                    </p>
                    <input type="text" class="form-control form-control-alternative"
                        placeholder=""
                        v-model="requirements"
                        :class="{ 'is-invalid': error.requirements }">
                    <div class="invalid-feedback">[[ error.requirements ]]</div>
                </form>
            </div>
        </div>
    `
}


register_component('scanner-python', PythonIntegration)

