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
    
    this.timer = undefined;
    

}

inherits(AfterSunset, AutomationModule);

_module = AfterSunset;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

AfterSunset.prototype.init = function (config) {
    AfterSunset.super_.prototype.init.call(this, config);
    
    var self = this;
    
    console.log("[AfterSunset] starting");
        
    var intervalTime    = 60000;
    
    self.timer = setInterval(function() {
        self.checkDevices();
    }, intervalTime);
   
};
    


AfterSunset.prototype.stop = function () {
    
    var self = this;
    
    if (self.timer) {
        clearInterval(self.timer);
        self.timer = undefined;
    }
      
    AfterSunset.super_.prototype.stop.call(this);
 
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

AfterSunset.prototype.checkDevices = function () {
    
    //console.log("[AfterSunset] check");
    var self = this;
    var now = new Date();
    
    var dDev = self.controller.devices.get(this.config.daylightdevice);
    if (dDev) {
        var sunset = dDev.get("metrics:sunset");
        var sunsetDate = new Date, time = sunset.split(/\:|\-/g);
        sunsetDate.setHours(time[0]);
        sunsetDate.setMinutes(time[1]);
        
        _.each(self.config.onofflights,function(element) {
            var vDev = self.controller.devices.get(element.device);
            if (vDev) {
                var deviceDate = new Date(sunsetDate.getTime() + (element.delay * 60000));
                if (deviceDate.getHours() === now.getHours() && deviceDate.getMinutes() === now.getMinutes()){
                    self.switchDevice(vDev,'on');
                }
            }
        });
                
        _.each(self.config.dimmers,function(element) {
            var vDev = self.controller.devices.get(element.device);
            if (vDev) {
                var deviceDate = new Date(sunsetDate.getTime() + (element.delay * 60000));
                if (deviceDate.getHours() === now.getHours() && deviceDate.getMinutes() === now.getMinutes()){
                    self.switchDevice(vDev,element.level);
                }
            }
        });
        
    }
    else {
        console.error("[AfterSunset] error starting module: daylightdevice not found");
    }

}

AfterSunset.prototype.switchDevice = function (device,state) {
    var self = this;
    if (state === 'on') {
       device.performCommand("on");
    }
    else {
        device.performCommand('exact',{ level: state });
    }
}