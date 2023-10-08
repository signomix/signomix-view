import { error } from '@sveltejs/kit';

export function load({ params }) {
    // echo -n myToken:dashboardID | base64
    let example = 'bXlUb2tlbjpkYXNoYm9hcmRJRA=='
    let parts = ['', '']
    try {
        let decoded = atob(params.path)
        parts = decoded.split(':')
        console.log('decoded', decoded)
        console.log('parts', parts)
    } catch (e) {
        console.log('error', e.message)
    }
    if(parts.length!=2 || parts[0]=='' || parts[1]==''){
        throw error(404, 'Not Found');
    }
    console.log('path', params.path)
    let data={name:parts[1],token:parts[0]} //name or ID
    let notFound = false
    //TODO: get dashboard data using nameOrId
    if(notFound){
        throw error(404, 'Not Found');
    }
    return data
    
}