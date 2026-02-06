import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useMonthlyReminder } from '../hooks/useMonthlyReminder';
import ManualEntryDisclosure from '../components/disclosures/ManualEntryDisclosure';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Info, Heart } from 'lucide-react';

export default function SettingsPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const { reminderEnabled, toggleReminder } = useMonthlyReminder();

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Name</Label>
            <p className="text-lg font-medium">{userProfile?.name || 'Loading...'}</p>
          </div>
          <Separator />
          <div>
            <Label className="text-sm text-muted-foreground">Principal ID</Label>
            <p className="text-xs font-mono break-all text-muted-foreground mt-1">
              {identity?.getPrincipal().toString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <Label htmlFor="monthly-reminder" className="text-base font-medium">
                Monthly Summary Reminder
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a new month starts to review your previous month's summary
              </p>
            </div>
            <Switch
              id="monthly-reminder"
              checked={reminderEnabled}
              onCheckedChange={toggleReminder}
              className="ml-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ManualEntryDisclosure />
          <Separator />
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              © 2026. Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
              <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium">
                caffeine.ai
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
