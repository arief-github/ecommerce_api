export const checkRequiredFields = (fields) => {
    const emptyFields = [];

    for (const field of fields) {
        if (!field.value) {
            emptyFields.push(field.name);
        }
    }

    return emptyFields;
}