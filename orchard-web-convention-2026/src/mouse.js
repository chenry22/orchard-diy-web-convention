window.addEventListener('load', () => {
    var characters = 'ABCDEFGHIJOPQRSTUVWXYabcdefghijklmnopqrstuwxyz34567890=[{]}!+;:\'\"<>?';
    let char = characters.charAt(Math.floor(Math.random() * characters.length));
    document.getElementById('mouseLight').textContent = char;
});

document.addEventListener('mousemove', (e) => {
    document.getElementById('mouseLight').style.left = (e.clientX - 15) + 'px';
    document.getElementById('mouseLight').style.top = (e.clientY - 15) + 'px';
});
document.addEventListener('touchmove', (e) => {
    document.getElementById('mouseLight').style.left = (e.touches[0].clientX - 15) + 'px';
    document.getElementById('mouseLight').style.top = (e.touches[0].clientY - 15) + 'px';
})