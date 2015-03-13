namespace Kendo.Mvc.UI.Fluent.Tests
{
	using Kendo.Mvc.Tests;	
	using Xunit;

	public class GridActionCommandFactoryTests
    {
        internal static GridActionColumn<Customer> column;

        public GridActionCommandFactoryTests()
        {
            column = new GridActionColumn<Customer>(new Grid<Customer>(TestHelper.CreateViewContext()));
        }

        private static GridActionCommandFactory<Customer> Factory()
        {
            return new GridActionCommandFactory<Customer>(column);
        }

        [Fact]
        public void Edit_command_should_EditCommand_to_commands_collection_of_the_column() 
        {
            column.Commands.Clear();
            
            Factory().Edit();

            var command = column.Commands[0];

            Assert.NotNull(command as GridEditActionCommand);
        }

        [Fact]
        public void Edit_command_should_enable_editing()
        {
            column.Grid.Editable.Enabled = false;

            Factory().Edit();

            Assert.True(column.Grid.Editable.Enabled);
        }

        [Fact]
        public void Delete_command_should_DeleteCommand_to_commands_collection_of_the_column()
        {
            column.Commands.Clear();

            Factory().Destroy();

            var command = column.Commands[0];

            Assert.NotNull(command as GridDestroyActionCommand);
        }

		[Fact]
		public void Delete_command_should_enable_editing()
        {
            column.Grid.Editable.Enabled = false;

            Factory().Destroy();

            Assert.True(column.Grid.Editable.Enabled);
        }
    }
}
