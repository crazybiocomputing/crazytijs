
/*
 * Riding the Nashorn: Programming JavaScript on the JVM
 * @author Niko Köbler
 * @link https://www.n-k.de/riding-the-nashorn/
 */
 
var global = this;
var window = this;
var process = {env:{}};

var console = {};
console.debug = print;
console.log = print;
console.warn = print;
console.error = print;
