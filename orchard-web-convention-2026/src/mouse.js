window.addEventListener('load', () => {
    var characters = 'ABCDEFGHIJLNOPQRSTUVWXYZabcdefghijlmnopqrstuvwxyz0123456789';
    let char = characters.charAt(Math.floor(Math.random() * characters.length));
    document.getElementById('mouseLight').textContent = char;
});
    document.addEventListener('mousemove', (e) => {
    document.getElementById('mouseLight').style.left = (e.clientX - 15) + 'px';
    document.getElementById('mouseLight').style.top = (e.clientY - 15) + 'px';
});