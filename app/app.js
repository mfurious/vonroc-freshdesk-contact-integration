  
const BASE_URL_1 = "<%= iparam.url1 %>/rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_email&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=Complete&searchCriteria[filterGroups][1][filters][0][conditionType]=in&searchCriteria[filterGroups][0][filters][0][value]=";
const BASE_URL_2 = "<%= iparam.url2 %>/rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_email&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=Complete&searchCriteria[filterGroups][1][filters][0][conditionType]=in&searchCriteria[filterGroups][0][filters][0][value]=";

$(document).ready(() => {
    app.initialized()
        .then(_client => {
          var client = _client;
          client.events.on('app.activated',() => {
            client.data.get('contact')
            .then(data => {
                  getOrders(client, data)
            })
            .catch(e => {
                console.log('Exception - ', e);
            });
        });
    });
});

getOrders = (client, data) => {
    $("#titleBody").remove();
    $("#magBody").remove();
    $("#ediBody").remove();
    
    $("#magTitle").append(`
        <div id="titleBody">
            <h2>Bestellingen</h2>
        </div>
        <div id="magBody"></div>
        <div id="ediBody"></div>
    `)


    data.contact.other_emails.unshift(data.contact.email);
    var mailList = data.contact.other_emails;

    mailList.forEach(mail => {
        requestMAGData(client, mail);
        requestEDIData(client, mail);
    });
}

requestMAGData = (client, mail) =>{
    var method = "get";
    var url = BASE_URL_1 + mail
    var options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer <%= iparam.a %>'
    }}

    client.request[method](url, options).then(data =>{
        data = JSON.parse(data.response)
    
        if (data.items < 1){
            return
        } else {
            data.items.forEach(order => {
                $("#magBody").append(`
                    <b>Order:</b> <a href="https://vonroc.com/admin_8yhl9t/sales/order/view/order_id/${order.entity_id}" target="_blank">#${order.increment_id}</a>
                    <br>
                `)
            })
        }
    })
}

requestEDIData = (client, mail) =>{
    var method = "get";
    var url = BASE_URL_2 + mail
    var options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer <%= iparam.a %>'
    }}

    client.request[method](url, options).then(data =>{
        data = JSON.parse(data.response)
    
        if (data.items < 1){
            return
        } else {
            data.items.forEach(order => {
                $("#ediBody").append(`
                        <a href="https://edi.vonroc.com/admin_8yhl9t/sales/order/view/order_id/${order.entity_id}" target="_blank">#${order.increment_id}</a> 
                        <br>
                `)
            })
        }
    })
}
