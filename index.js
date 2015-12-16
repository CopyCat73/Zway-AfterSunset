/*** AfterSunset Z-Way module *******************************************

Version: 1.00
(c) CopyCatz, 2015
-----------------------------------------------------------------------------
Author: CopyCatz <copycat73@outlook.com>
Description: Light switching at set interval after sunset.

******************************************************************************/

function AfterSunset (id, controller) {
    // Call superconstructor first (AutomationModule)
    AfterSunset.super_.call(this, id, controller);
    

}

inherits(AfterSunset, AutomationModule);

_module = AfterSunset;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

AfterSunset.prototype.init = function (config) {
    AfterSunset.super_.prototype.init.call(this, config);
    
    this.controller.on("daylight.sunset", this.scheduleDevices);
       
};
    


AfterSunset.prototype.stop = function () {
    
    var self = this;
    
    this.controller.off("daylight.sunset", this.scheduleDevices);
    
    AfterSunset.super_.prototype.stop.call(this);
 
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

AfterSunset.prototype.scheduleDevices = function () {
    var self = this;

    _.each(self.config.onofflights,function(element) {
        var vDev = self.controller.devices.get(element.device);
        if (vDev) {
            var timeout = element.delay*60000;
            setTimeout(
            _.bind(self.switchDevice,self,vDev,'on'),
            timeout);
        }
    });
            
    _.each(self.config.dimmers,function(element) {
        var vDev = self.controller.devices.get(element.device);
        if (vDev) {
            var timeout = element.delay*60000;
            setTimeout(
            _.bind(self.switchDevice,self,vDev,element.level),
            timeout);
        }
    });    
}

AfterSunset.prototype.switchDevice = function (device,state) {
    var self = this;
    if (state === 'on') {
       device.performCommand("on");
    }
    else {
        device.set("metrics:level",state);
    }

}