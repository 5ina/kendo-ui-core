﻿using Kendo.Mvc.Tests;
using Kendo.Mvc.UI.Fluent;
using System.Collections.Generic;
using Xunit;

namespace Kendo.Mvc.UI.Tests
{
    public class SchedulerDataSourceTests
    {
        private readonly Scheduler<SchedulerEvent> scheduler;
        private readonly SchedulerBuilder<SchedulerEvent> builder;

        public SchedulerDataSourceTests()
        {
            scheduler = new Scheduler<SchedulerEvent>(TestHelper.CreateViewContext());
            builder = new SchedulerBuilder<SchedulerEvent>(scheduler);
        }

        [Fact]
        public void Custom_dataSource_is_serialized_correctly_with_server_operations_false_and_local_data()
        {
            List<SchedulerEvent> events = new List<SchedulerEvent> { new SchedulerEvent() };
            builder.DataSource(ds => ds.Custom()
                    .ServerAggregates(false)
                    .ServerFiltering(false)
                    .ServerGrouping(false)
                    .ServerPaging(false)
                    .ServerSorting(false));

            builder.BindTo(events);

            var dataSource = scheduler.DataSource.ToJson();

            Assert.Equal(events, dataSource["data"]);
        }

        [Fact]
        public void Custom_dataSource_is_serialized_correctly_with_server_operations_true_and_local_data()
        {
            List<SchedulerEvent> events = new List<SchedulerEvent> { new SchedulerEvent() };
            builder.DataSource(ds => ds.Custom()
                    .ServerAggregates(true)
                    .ServerFiltering(true)
                    .ServerGrouping(true)
                    .ServerPaging(true)
                    .ServerSorting(true));

            builder.BindTo(events);

            var dataSource = scheduler.DataSource.ToJson();

            Assert.Equal(events, dataSource["data"]);
        }

        [Fact]
        public void Custom_dataSource_is_serialized_correctly_with_server_operations_false_local_data_and_schema_data_set()
        {
            List<SchedulerEvent> events = new List<SchedulerEvent> { new SchedulerEvent() };
            builder.DataSource(ds => ds.Custom()
                    .ServerAggregates(false)
                    .ServerFiltering(false)
                    .ServerGrouping(false)
                    .ServerPaging(false)
                    .ServerSorting(false)
                    .Schema(s => s
                        .Data("Data")
                        .Total("Total")
                        .Errors("Errors")
                    ));

            builder.BindTo(events);

            var dataSource = scheduler.DataSource.ToJson();

            Assert.Equal(events, ((Dictionary<string, object>)dataSource["data"])["Data"]);
        }

        [Fact]
        public void Custom_dataSource_is_serialized_correctly_with_server_operations_true_local_data_and_schema_data_set()
        {
            List<SchedulerEvent> events = new List<SchedulerEvent> { new SchedulerEvent() };
            builder.DataSource(ds => ds.Custom()
                    .ServerAggregates(true)
                    .ServerFiltering(true)
                    .ServerGrouping(true)
                    .ServerPaging(true)
                    .ServerSorting(true)
                    .Schema(s => s
                        .Data("Data")
                        .Total("Total")
                        .Errors("Errors")
                    ));

            builder.BindTo(events);

            var dataSource = scheduler.DataSource.ToJson();

            Assert.Equal(events, ((Dictionary<string, object>)dataSource["data"])["Data"]);
        }
    }
}
