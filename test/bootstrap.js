/**
 * Created by toddgeist on 5/3/15.
 */
require('dotenv').config();

var chai = require('chai');
var should = chai.should();

var fms =  require('../index');
var config = require('./config')

global.connection = fms.connection(config);

require('./unit/fmsTest.js');
require('./unit/layoutTest.js');