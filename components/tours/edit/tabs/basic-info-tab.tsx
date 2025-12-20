  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import { UpdateTourData } from '@/types/tour.types';

  interface BasicInfoTabProps {
    formData: UpdateTourData;
    updateField: (field: keyof UpdateTourData, value : any) => void;
  }

  export function BasicInfoTab({ formData, updateField }: BasicInfoTabProps) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential tour details and SEO information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter tour title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="tour-slug"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metatitle">Meta Title</Label>
              <Input
                id="metatitle"
                value={formData.metatitle}
                onChange={(e) => updateField('metatitle', e.target.value)}
                placeholder="SEO meta title"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {formData.metatitle?.length || 0}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadesc">Meta Description</Label>
              <Textarea
                id="metadesc"
                value={formData.metadesc}
                onChange={(e) => updateField('metadesc', e.target.value)}
                placeholder="SEO meta description"
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {formData.metadesc?.length || 0}/160 characters
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="durationDays">Duration (Days)</Label>
                <Input
                  id="durationDays"
                  type="number"
                  min="0"
                  value={formData.durationDays}
                  onChange={(e) => updateField('durationDays', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationNights">Duration (Nights)</Label>
                <Input
                  id="durationNights"
                  type="number"
                  min="0"
                  value={formData.durationNights}
                  onChange={(e) => updateField('durationNights', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
