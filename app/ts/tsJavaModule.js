require('source-map-support').install();
var _java = require('java');
var _ = require('lodash');
var BluePromise = require('bluebird');
var path = require('path');
_java.asyncOptions = {
    syncSuffix: '',
    asyncSuffix: 'A',
    promiseSuffix: 'P',
    promisify: BluePromise.promisify
};
// JVM initialization callback which adds tsjava.classpath to the JVM classpath.
function beforeJvm() {
    var moduleJars = ['bin/electron-node-java-0.0.1-jar-with-dependencies.jar'];
    moduleJars.forEach(function (jarPath) {
        var fullJarPath = path.join(__dirname, '..', jarPath);
        _java.classpath.push(fullJarPath);
    });
    return BluePromise.resolve();
}
_java.registerClientP(beforeJvm);
var Java;
(function (Java) {
    'use strict';
    function getJava() {
        return _java;
    }
    Java.getJava = getJava;
    function ensureJvm() {
        return _java.ensureJvm();
    }
    Java.ensureJvm = ensureJvm;
    // Return the fully qualified class path for a class name.
    // Returns undefined if the className is ambiguous or not present in the configured classes.
    function fullyQualifiedName(className) {
        var shortToLongMap = {
            'Item': 'com.todo.Item',
            'Repository': 'com.todo.Repository',
            'Object': 'java.lang.Object',
            'String': 'java.lang.String'
        };
        return shortToLongMap[className];
    }
    Java.fullyQualifiedName = fullyQualifiedName;
    function importClass(className) {
        var fullName = fullyQualifiedName(className) || className;
        return _java.import(fullName);
    }
    Java.importClass = importClass;
    function asInstanceOf(obj, className) {
        var fullName = fullyQualifiedName(className) || className;
        if (_java.instanceOf(obj, fullName)) {
            return obj;
        }
        else {
            throw new Error('asInstanceOf fails, obj is not a ' + fullName);
        }
    }
    Java.asInstanceOf = asInstanceOf;
    // Returns true if javaObject is an instance of the named class, which may be a short className.
    // Returns false if javaObject is not an instance of the named class.
    // Throws an exception if the named class does not exist, or is an ambiguous short name.
    function instanceOf(javaObject, className) {
        var fullName = fullyQualifiedName(className) || className;
        return smellsLikeJavaObject(javaObject) && _java.instanceOf(javaObject, fullName);
    }
    Java.instanceOf = instanceOf;
    function newInstanceA(className) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var fullName = fullyQualifiedName(className) || className;
        args.unshift(fullName);
        return _java.newInstance.apply(_java, args);
    }
    Java.newInstanceA = newInstanceA;
    function newInstance(className) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var fullName = fullyQualifiedName(className) || className;
        args.unshift(fullName);
        return _java.newInstanceSync.apply(_java, args);
    }
    Java.newInstance = newInstance;
    function newInstanceP(className) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var fullName = fullyQualifiedName(className) || className;
        args.unshift(fullName);
        return _java.newInstanceP.apply(_java, args);
    }
    Java.newInstanceP = newInstanceP;
    function newArray(className, arg) {
        var fullName = fullyQualifiedName(className) || className;
        return _java.newArray(fullName, arg);
    }
    Java.newArray = newArray;
    // #### `function smellsLikeJavaObject(e: any)`
    // Returns true if the obj 'smells' like a Java object.
    // This is a light-weight test that will return false when `e` is clearly not a Java object,
    // but it may have false positives. To be certain, use `isJavaObject(e)` or `instanceOf(e, classname)` instead.
    function smellsLikeJavaObject(e) {
        return _.isObject(e) && !_.isArray(e);
    }
    // #### `function isJavaObject(e: any)`
    // Returns true if the obj is a Java object.
    // Useful for determining the runtime type of object_t returned by many java methods.
    function isJavaObject(e) {
        return smellsLikeJavaObject(e) && _java.instanceOf(e, 'java.lang.Object');
    }
    Java.isJavaObject = isJavaObject;
})(Java = exports.Java || (exports.Java = {})); // module Java
