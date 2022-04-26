/**
 * The following strategy of importing modules allows the tests to be run in a browser environment.
 * Test libraries like `mocha`, `sinon`, etc. are expected to be loaded before this file.
 */
 var sinon = sinon || require('sinon');
 var chai = chai || require('chai');
 var expect = chai.expect;
 
 if (typeof window === 'undefined') {
   require('mocha');
   require('jsdom-global')();
 }
 
 // Load libraries that require access to the DOM after `jsdom-global`
 var keybind = keybind || require('./../lib/keybind.umd');
 var KeyEvent = KeyEvent || require('./libs/key-event');
 
 
 
 // Reset keybind after each test
 afterEach(function () {
  //  keybind.reset();
 });
 
 describe('keybind.bind', function () {
   describe('basic', function () {

     it('z key fires when pressing z', function () {
       var spy = sinon.spy();
 
       keybind.bind('z', spy);
 
       KeyEvent.simulate('Z'.charCodeAt(0), 90);
      
       expect(spy.callCount).to.equal(1, 'callback should fire once');
       expect(spy.args[0][0]).to.be.an.instanceOf(Event, 'first argument should be Event');
     });
 

     it('z key does not fire when pressing b', function () {
       var spy = sinon.spy();
 
       keybind.bind('z', spy);
 
       KeyEvent.simulate('B'.charCodeAt(0), 66);
 
       expect(spy.callCount).to.equal(0);
     });
 
     it('z key does not fire when holding a modifier key', function () {
       var spy = sinon.spy();
       var modifiers = ['ctrl', 'alt', 'meta', 'shift'];
       var charCode;
       var modifier;
 
       keybind.bind('z', spy);
 
       for (var i = 0; i < 4; i++) {
         modifier = modifiers[i];
         charCode = 'Z'.charCodeAt(0);
 
         // character code is different when alt is pressed
         if (modifier == 'alt') {
           charCode = 'Ω'.charCodeAt(0);
         }
 
         spy.resetHistory();
 
         KeyEvent.simulate(charCode, 90, [modifier]);
 
         expect(spy.callCount).to.equal(0);
       }
     });
 
     
     it('rebinding a key', function () {
       var spy1 = sinon.spy();
       var spy2 = sinon.spy();
       keybind.bind('x', spy1);
       keybind.bind('x', spy2);
 
       KeyEvent.simulate('X'.charCodeAt(0), 88);
 
       expect(spy1.callCount).to.equal(1, 'original callback should not fire');
       expect(spy2.callCount).to.equal(1, 'new callback should fire');
     });
 
     it('binding an array of keys', function () {
       var spy = sinon.spy();
       keybind.bind(['a', 'b', 'c'], spy);
 
       KeyEvent.simulate('a'.charCodeAt(0), 65);
       expect(spy.callCount).to.equal(1, 'new callback was called');

 
       KeyEvent.simulate('b'.charCodeAt(0), 66);
       expect(spy.callCount).to.equal(2, 'new callback was called twice');

 
       KeyEvent.simulate('c'.charCodeAt(0), 67);
       expect(spy.callCount).to.equal(3, 'new callback was called three times');

     });
 
   });
 
   describe('combos with modifiers', function () {

 
     it('should fire callback when ctrl+numpad 0 is pressed', function () {
       var spy = sinon.spy();
 
       keybind.bind('ctrl+0', spy);
 
       // numpad 0 keycode
       KeyEvent.simulate(96, 96, ['ctrl']);
 
       expect(spy.callCount).to.equal(1, 'callback should fire once');
       expect(spy.args[0][0]).to.be.an.instanceOf(Event, 'first argument should be Event');
     });
   });
 });
 
 describe('keybind.unbind', function () {
   it('unbind works', function () {
     var spy = sinon.spy();
     keybind.bind('a', spy);
     KeyEvent.simulate('a'.charCodeAt(0), 65);
     expect(spy.callCount).to.equal(1, 'callback for a should fire');
 
     keybind.unbind('a');
     KeyEvent.simulate('a'.charCodeAt(0), 65);
     expect(spy.callCount).to.equal(1, 'callback for a should not fire after unbind');
   });
 
   it('unbind accepts an array', function () {
     var spy = sinon.spy();
     keybind.bind(['a', 'b', 'c'], spy);
     KeyEvent.simulate('a'.charCodeAt(0), 65);
     KeyEvent.simulate('b'.charCodeAt(0), 66);
     KeyEvent.simulate('c'.charCodeAt(0), 67);
     expect(spy.callCount).to.equal(3, 'callback should have fired 3 times');
 
     keybind.unbind(['a', 'b', 'c']);
     KeyEvent.simulate('a'.charCodeAt(0), 65);
     KeyEvent.simulate('b'.charCodeAt(0), 66);
     KeyEvent.simulate('c'.charCodeAt(0), 67);
     expect(spy.callCount).to.equal(3, 'callback should not fire after unbind');
   });
 });