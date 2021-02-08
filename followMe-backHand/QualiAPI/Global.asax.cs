using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Diagnostics;
using System.Timers;
using System.Web.Configuration;


namespace QualiAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        private static double TimerIntervalInMilliseconds =
        Convert.ToDouble(WebConfigurationManager.AppSettings["TimerIntervalInMilliseconds"]);
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            Debug.WriteLine(string.Concat("Application_Start Called: ", DateTime.Now.ToString()));
            // This will raise the Elapsed event every 'x' millisceonds (whatever you set in the
            // Web.Config file for the added TimerIntervalInMilliseconds AppSetting
            Timer timer = new Timer(TimerIntervalInMilliseconds);

            timer.Enabled = true;

            // Setup Event Handler for Timer Elapsed Event
            timer.Elapsed += new ElapsedEventHandler(timer_Elapsed);

            timer.Start();
        }

        // Added the following procedure:
        static void timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            // Get the TimerStartTime web.config value
            DateTime MyScheduledRunTime = DateTime.Parse(WebConfigurationManager.AppSettings["TimerStartTime"]);

            // Get the current system time
            DateTime CurrentSystemTime = DateTime.Now;

            Debug.WriteLine(string.Concat("Timer Event Handler Called: ", CurrentSystemTime.ToString()));

            // This makes sure your code will only run once within the time frame of (Start Time) to
            // (Start Time+Interval). The timer's interval and this (Start Time+Interval) must stay in sync
            // or your code may not run, could run once, or may run multiple times per day.
            DateTime LatestRunTime = MyScheduledRunTime.AddMilliseconds(TimerIntervalInMilliseconds);

            // If within the (Start Time) to (Start Time+Interval) time frame - run the processes
            if ((CurrentSystemTime.CompareTo(MyScheduledRunTime) >= 0) && (CurrentSystemTime.CompareTo(LatestRunTime) <= 0))
            {
                Debug.WriteLine(String.Concat("Timer Event Handling MyScheduledRunTime Actions: ", DateTime.Now.ToString()));
                // RUN YOUR PROCESSES HERE
            }

            //DateTime MyScheduledRunTime = DateTime.Parse(WebConfigurationManager.AppSettings["TimerStartTime"]);
            //DateTime CurrentSystemTime = DateTime.Now;
            //DateTime LatestRunTime = MyScheduledRunTime.AddMilliseconds(TimerIntervalInMilliseconds);
            //if ((CurrentSystemTime.CompareTo(MyScheduledRunTime) >= 0) && (CurrentSystemTime.CompareTo(LatestRunTime) <= 0))
            //{
            //    // RUN YOUR PROCESSES HERE
            //}
        }
    }
}
