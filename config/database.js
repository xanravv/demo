if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://warnax:warnax@ds129906.mlab.com:29906/vidjot-production'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}