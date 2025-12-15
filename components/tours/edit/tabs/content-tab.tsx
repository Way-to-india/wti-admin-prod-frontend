import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { UpdateTourData } from '@/services/tour.service';

interface ContentTabProps {
  formData: UpdateTourData;
  updateField: (field: keyof UpdateTourData, value: any) => void;
}

export function ContentTab({ formData, updateField }: ContentTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Brief introduction with rich formatting</CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={formData.overview || ''}
            onChange={(content) => updateField('overview', content)}
            placeholder="Enter tour overview with formatting..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>Detailed tour description with rich formatting</CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={formData.description || ''}
            onChange={(content) => updateField('description', content)}
            placeholder="Enter detailed description with formatting..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Travel Tips</CardTitle>
          <CardDescription>
            Important travel information with full formatting support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={formData.travelTips || ''}
            onChange={(content) => updateField('travelTips', content)}
            placeholder="Enter travel tips with formatting..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cancellation Policy</CardTitle>
          <CardDescription>Terms and conditions for cancellations</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.cancellationPolicy || ''}
            onChange={(e) => updateField('cancellationPolicy', e.target.value)}
            placeholder="Enter cancellation policy..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}
