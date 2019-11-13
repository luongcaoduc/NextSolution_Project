module.exports = (res) => {
    return res.status(404).send({
        'status': false,
        'err': 'Email and password not correct'
    });
};
