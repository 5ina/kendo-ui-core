﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using KendoScaffolder.UI.Models;
//using Microsoft.VisualStudio.PlatformUI;

namespace KendoScaffolder.UI
{
    /// <summary>
    /// Interaction logic
    /// </summary>
    public partial class GridConfigurationWindow : Window
    {
        public const string WebGridTitle = "Kendo UI Grid";
        public const string MvcGridTitle = "Telerik ASP.NET MVC Grid";

        public GridConfigurationWindow(GridConfigurationViewModel viewModel)
        {
            WindowStartupLocation = WindowStartupLocation.CenterScreen;

            InitializeComponent();

            GridEventsListBox.SelectionChanged += GridEventsListBoxSelectionChanged;

            if (viewModel.ViewType == ViewType.MVC)
            {
                WidgetTitle.Text = MvcGridTitle;
                this.Title = MvcGridTitle;
            }
            else
            {
                WidgetTitle.Text = WebGridTitle;
                this.Title = WebGridTitle;
            }

            DataContext = viewModel;
        }

        private static void GridEventsListBoxSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var gridEventsListBox = sender as ListBox;
            if (gridEventsListBox == null) return;

            var viewModel = gridEventsListBox.DataContext as GridConfigurationViewModel;
            if (viewModel == null) return;

            viewModel.SelectedGridEvents.Clear();

            foreach (CheckBoxListItem item in gridEventsListBox.SelectedItems)
            {
                viewModel.SelectedGridEvents.Add(item.Text);
            }
        }

        private void AddButton_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }

        private void Selectable_Clicked(object sender, RoutedEventArgs e)
        {
            if (SelectionModeWrapPanel.Visibility == Visibility.Visible)
            {
                SelectionModeWrapPanel.Visibility = Visibility.Collapsed;
                SelectionTypeWrapPanel.Visibility = Visibility.Collapsed;
            }
            else
            {
                SelectionModeWrapPanel.Visibility = Visibility.Visible;
                SelectionTypeWrapPanel.Visibility = Visibility.Visible;
            }
        }

        private void Sortable_Clicked(object sender, RoutedEventArgs e)
        {
            if (SortableAllowUnsort.Visibility == Visibility.Visible)
            {
                SortableAllowUnsort.Visibility = Visibility.Collapsed;
                SortableModeWrapPanel.Visibility = Visibility.Collapsed;
            }
            else
            {
                SortableAllowUnsort.Visibility = Visibility.Visible;
                SortableModeWrapPanel.Visibility = Visibility.Visible;
            }
        }

        private void Filterable_Clicked(object sender, RoutedEventArgs e)
        {
            if (FilterableWrapPanel.Visibility == Visibility.Visible)
            {
                FilterableWrapPanel.Visibility = Visibility.Collapsed;
            }
            else
            {
                FilterableWrapPanel.Visibility = Visibility.Visible;
            }
        }

        private void Editable_Clicked(object sender, RoutedEventArgs e)
        {
            if (EditModeWrapPanel.Visibility == Visibility.Visible)
            {
                EditModeWrapPanel.Visibility = Visibility.Collapsed;
                CrudOperationsWrapPanel.Visibility = Visibility.Collapsed;
            }
            else
            {
                EditModeWrapPanel.Visibility = Visibility.Visible;
                CrudOperationsWrapPanel.Visibility = Visibility.Visible;
            }
        }

        private void UseViewModel_Clicked(object sender, RoutedEventArgs e)
        {
            if (ViewModelType.Visibility == Visibility.Visible)
            {
                ViewModelType.Visibility = Visibility.Collapsed;
                ViewModelTypeLabel.Visibility = Visibility.Collapsed;
            }
            else
            {
                ViewModelType.Visibility = Visibility.Visible;
                ViewModelTypeLabel.Visibility = Visibility.Visible;
            }
            ToggleAddButtonState();
        }

        private void ControllerName_Loaded(object sender, System.Windows.RoutedEventArgs e)
        {
            TextBox current = ((TextBox)sender);
            current.Text = "GridController";
            current.Focus();
            current.Select(0, 4);
        }

        private void ViewName_Loaded(object sender, System.Windows.RoutedEventArgs e)
        {
            TextBox current = ((TextBox)sender);
            current.Text = "Index";
        }

        private void RequiredField_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ToggleAddButtonState();
        }

        private void ToggleAddButtonState()
        {
            bool useViewModel = UseViewModel.IsChecked ?? false;
            if (ModelType.SelectedValue != null && DataContextClass.SelectedValue != null)
            {
                if (!useViewModel || (useViewModel && ViewModelType.SelectedValue != null))
                {
                    AddButton.IsEnabled = true;
                }
                else
                {
                    AddButton.IsEnabled = false;
                }
            }
            else
            {
                AddButton.IsEnabled = false;
            }
        }

        private void GridEventsCheckbox_Clicked(object sender, RoutedEventArgs e)
        {
            CheckBox cb = sender as CheckBox;
            var item = cb.DataContext;

            if (cb.IsChecked.Value)
            {
                GridEventsListBox.SelectedItems.Add(item);
            }
            else
            {
                GridEventsListBox.SelectedItems.Remove(item);
            }
        }

        private void SelectedDataSourceType_Changed(object sender, RoutedEventArgs e)
        {
            ComboBox cb = sender as ComboBox;
            string item = cb.SelectedItem.ToString();
            var viewModel = cb.DataContext as GridConfigurationViewModel;

            RequireMvc.Visibility = (item.Equals("WebApi") && viewModel.ViewType == ViewType.Web) ? Visibility.Visible : Visibility.Hidden;
            ServerOperation.Visibility = (item.Equals("Server")) ? Visibility.Hidden : Visibility.Visible;
        }
    }

    //public class EnumToBooleanConverter : IValueConverter
    //{
    //    public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
    //    {
    //        return value.Equals(parameter);
    //    }

    //    public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
    //    {
    //        return value.Equals(true) ? parameter : Binding.DoNothing;
    //    }
    //}
}
