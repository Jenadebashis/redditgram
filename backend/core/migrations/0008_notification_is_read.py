from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_tag_bookmark_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='is_read',
            field=models.BooleanField(default=False),
        ),
    ]
