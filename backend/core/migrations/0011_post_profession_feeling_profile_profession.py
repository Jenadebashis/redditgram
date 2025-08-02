from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_merge_0009_comment_parent_0009_commentlike'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='profession',
            field=models.CharField(blank=True, null=True, choices=[('doctor', 'Doctor'), ('engineer', 'Engineer'), ('teacher', 'Teacher'), ('lawyer', 'Lawyer'), ('nurse', 'Nurse'), ('scientist', 'Scientist'), ('accountant', 'Accountant'), ('artist', 'Artist'), ('manager', 'Manager'), ('developer', 'Developer')], max_length=30),
        ),
        migrations.AddField(
            model_name='post',
            name='feeling',
            field=models.CharField(blank=True, null=True, choices=[('happy', 'Happy'), ('sad', 'Sad'), ('angry', 'Angry'), ('fear', 'Fear'), ('surprise', 'Surprise'), ('disgust', 'Disgust'), ('trust', 'Trust'), ('anticipation', 'Anticipation')], max_length=30),
        ),
        migrations.AddField(
            model_name='post',
            name='profession',
            field=models.CharField(blank=True, null=True, choices=[('doctor', 'Doctor'), ('engineer', 'Engineer'), ('teacher', 'Teacher'), ('lawyer', 'Lawyer'), ('nurse', 'Nurse'), ('scientist', 'Scientist'), ('accountant', 'Accountant'), ('artist', 'Artist'), ('manager', 'Manager'), ('developer', 'Developer')], max_length=30),
        ),
    ]
