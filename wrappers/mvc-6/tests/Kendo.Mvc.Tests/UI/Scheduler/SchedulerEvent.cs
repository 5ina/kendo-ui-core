﻿using System;

namespace Kendo.Mvc.UI.Tests
{
    public class SchedulerEvent : ISchedulerEvent
    {
        public int Id
        {
            get;
            set;
        }

        public string Title
        {
            get;
            set;
        }

        public string Description
        {
            get;
            set;
        }

        public bool IsAllDay
        {
            get;
            set;
        }

        private DateTime start;
        public DateTime Start
        {
            get
            {
                return start;
            }
            set
            {
                start = value.ToUniversalTime();
            }
        }

        private DateTime end;
        public DateTime End
        {
            get
            {
                return end;
            }
            set
            {
                end = value.ToUniversalTime();
            }
        }

        public string Recurrence
        {
            get;
            set;
        }


        public string RecurrenceRule
        {
            get;
            set;
        }

        public string RecurrenceException
        {
            get;
            set;
        }

        public string StartTimezone
        {
            get;
            set;
        }

        public string EndTimezone
        {
            get;
            set;
        }
    }
}
