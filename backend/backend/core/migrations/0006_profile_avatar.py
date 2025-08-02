from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_comment_like_follow'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='avatars/'),
        ),
    ]
