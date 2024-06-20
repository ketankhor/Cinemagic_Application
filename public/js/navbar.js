async function login(form) {
    const email = document.querySelector(' input[type="email"]').value;
    const password = document.querySelector('form  input[type="password"]').value;
    const body = JSON.stringify({ email, password })
    console.log(body)
    const res = await fetch('http://127.0.0.1:3000/api/user/login', {
        method: "POST",
        body: body,
        headers: {
            'content-type': 'application/json'
        },
        credentials: "same-origin"
    });
    const data = await res.json();
    console.log(data)
    alert(data.message)
    if(data.status==='pending'){
        verifyMail(data)
        console.log(data)
    }
    if(data.status==='success'){

        localStorage.setItem('user',JSON.stringify(data.user))
        console.log(JSON.parse(localStorage.getItem('user')))
    }

}
function verifyMail({user}){
    const button=document.querySelector('#verifyBtn');

    button.style.display='inline-block';
    button.addEventListener('click',e=>{
        button.disabled=true;
        sendEmail(user)
        button.textContent='resend',
        setTimeout(()=>button.disabled=false,2000*60)
    })
}
async function sendEmail(user){
    console.log(user)
    const res = await fetch('http://127.0.0.1:3000/api/user/verify',{
        method:'POST',
        body:JSON.stringify(user),
        headers:{
            'content-type':'application/json'
        }
    })
    const data=await res.json();
    alert(data.message)
}
async function logout(btn) {

    btn.textContent = 'logging out...';
    const res = await fetch('http://127.0.0.1:3000/api/user/logout', {
        credentials: "same-origin"
    });
    const data = await res.json();
    console.log(data)
    btn.textContent = 'logout'
    alert('logout successfully')
}
document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        login(form);
    })
})