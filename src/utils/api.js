var api = {};
api = {
    getUser: function (params, callback) {
        fetch('/api/db/db.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            var result = json;
            console.log(result);
            callback(result);
        }).catch(function (ex) {
            // console.log('parsing failed', ex);
        })
    }
}
api.getUser({},function(json){
    document.getElementById('db').innerHTML = JSON.stringify(json);
})