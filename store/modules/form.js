export default {
    state: {
        forms: [],
    },

    mutations: {
        saveInput(state, data) {
            if (!data.form) {
                return;
            }

            if (!state.forms[data.form]) {
                state.forms[data.form] = {};
            }

            state.forms[data.form][data.name] = data.value;
        }
    },

    getters: {
        getFormData: (state) => async (form) => {
            try {
                let forms = await state.forms;

                return forms[form];
            } catch (e) {
                // console.log(e);
            }
        }
    }
}
