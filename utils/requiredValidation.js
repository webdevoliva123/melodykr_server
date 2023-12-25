exports.requiredValidationResponse = (validateToData,res) => {
    validateToData?.map((validateObj) => {
        const {regex,errorMessage,data} = validateObj
        if(!regex?.test(data)){
            return res.status(400).json({
                success : false,
                message : "something went wrong",
                error : errorMessage
            })
        }
    })
}