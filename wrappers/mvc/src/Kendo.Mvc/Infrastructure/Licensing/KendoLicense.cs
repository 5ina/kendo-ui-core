﻿using System;
using System.Configuration;
using System.Linq;

namespace Kendo.Mvc.Infrastructure.Licensing
{
	internal class KendoLicense : System.ComponentModel.License
    {
        private const int TRIAL_DURATION = 30;
        private const int TRIAL_EXTENSION = 15;
        private const string TRIAL_START_KEY_PREFIX = "Telerik";
        private const string TRIAL_EXTENDED_START_KEY_PREFIX = "TelerikExtended";
        private const string TRIAL_LAST_KEY_PREFIX = "TelerikLast";
        private const string REGISTRY_SUB_KEY = "Software\\Telerik\\MVC";
        private const string REGISTRY_SECONDARY_SUB_KEY = "Software\\Microsoft\\MSNT";
        private const string APP_SETTINGS_TRIAL_KEY = "Kendo.Mvc.UI.TrialKey";

        private int? _trialDaysLeft = null;

        public override string LicenseKey { get { return ""; } }

        internal Type Type { get; set; }

        internal KendoLicenseStatus LicenseStatus
        {
            get
            {
                KendoLicenseStatus status = KendoLicenseStatus.Full;
#if TRIAL
                status = KendoLicenseStatus.Trial;
#endif

                return status;
            }
        }

        internal string AssemblyVersion
        {
            get
            {
                return Type.Assembly.GetName().Version.ToString();
            }
        }

        internal bool IsExtended
        {
            get
            {
                var trialKey = ConfigurationManager.AppSettings[APP_SETTINGS_TRIAL_KEY];

                return !string.IsNullOrEmpty(trialKey) &&
                    trialKey.Equals(RegistryUtilities.EncodeString(AssemblyVersion.ToString()));
            }
        }

        internal int TrialDuration
        {
            get
            {
                if (IsExtended)
                {
                    return TRIAL_EXTENSION;
                }

                return TRIAL_DURATION;
            }
        }

        internal int TrialDaysLeft
        {
            get
            {
                if (this.LicenseStatus == KendoLicenseStatus.Full)
                {
                    return int.MaxValue;
                }

                if (_trialDaysLeft != null)
                {
                    return _trialDaysLeft.Value;
                }

                DateTime trialStart = GetTrialStart();
                DateTime trialLastUse = GetTrialLastUse();

                _trialDaysLeft = TrialDuration - ((int)trialLastUse.Subtract(trialStart).TotalDays);

                return _trialDaysLeft.Value;
            }
        }

        private DateTime GetTrialStart()
        {
            var prefix = IsExtended ? TRIAL_EXTENDED_START_KEY_PREFIX : TRIAL_START_KEY_PREFIX;
            string registryKeyString = string.Concat(prefix, AssemblyVersion);
            DateTime trialStart = DateTime.MinValue;

            string trialStartHash = RegistryUtilities.ReadRegistryString(
                REGISTRY_SECONDARY_SUB_KEY,
                registryKeyString.GetHashCode().ToString());

            if (RegistryUtilities.RegistryKeyExists(
                REGISTRY_SUB_KEY,
                registryKeyString))
            {
                DateTime registeredTrialStart = RegistryUtilities.ReadRegistryDate(
                    REGISTRY_SUB_KEY,
                    registryKeyString,
                    DateTime.MinValue);

                if (trialStartHash != null &&
                    trialStartHash.Equals(registeredTrialStart.GetHashCode().ToString()))
                {
                    trialStart = registeredTrialStart;
                }
            }
            else
            {
                if (trialStartHash == null)
                {
                    trialStart = DateTime.Now;

                    RegistryUtilities.SaveRegistryDate(
                        REGISTRY_SUB_KEY,
                        registryKeyString,
                        trialStart);

                    RegistryUtilities.SaveRegistryString(
                        REGISTRY_SECONDARY_SUB_KEY,
                        registryKeyString.GetHashCode().ToString(),
                        trialStart.GetHashCode().ToString());
                }
            }

            return trialStart;
        }

        private DateTime GetTrialLastUse()
        {
            string registryKeyString = string.Concat(TRIAL_LAST_KEY_PREFIX, AssemblyVersion);
            DateTime trialLastUse = DateTime.Now;

            DateTime lastRegisteredUse = RegistryUtilities.ReadRegistryDate(
                REGISTRY_SUB_KEY,
                registryKeyString,
                DateTime.MinValue);

            if (lastRegisteredUse == DateTime.MinValue || lastRegisteredUse < trialLastUse)
            {
                RegistryUtilities.SaveRegistryDate(
                    REGISTRY_SUB_KEY,
                    registryKeyString,
                    trialLastUse);
            }
            else
            {
                trialLastUse = lastRegisteredUse;
            }

            return trialLastUse;
        }

        internal KendoLicense(System.Type type)
        {
            this.Type = type;
        }

        public override void Dispose()
        {
        }
    }
}
